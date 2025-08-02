<?php

namespace App\Http\Controllers\Api;

use App\Models\Round;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class RoundController extends Controller
{
    /**
     * Display a listing of the resource (only for the connected user).
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return Round::where('user_id', $user->id)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'date' => 'required|date',
            'type_optimisation' => ['required', Rule::in(['shortest', 'fastest', 'eco'])],
            'itinerary' => 'required|string|max:255',
        ]);

        $validated['user_id'] = $user->id;

        $round = Round::create($validated);
        if (!$round) {
            return response()->json(['message' => 'error in round creation'], 400);
        }
        return response()->json($round, 201);
    }

    /**
     * Display the specified resource (only if it belongs to the user).
     */
    public function show(Request $request, string $id)
    {
        $user = $request->user();
        $round = Round::where('id', $id)->where('user_id', $user->id)->first();

        if (!$round) {
            return response()->json(['message' => 'Round not found'], 404);
        }

        return response()->json($round);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $round = Round::where('id', $id)->where('user_id', $user->id)->first();

        if (!$round) {
            return response()->json(['message' => 'Round not found'], 404);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'type_optimisation' => ['sometimes', Rule::in(['shortest', 'fastest', 'eco'])],
            'itinerary' => 'required|string|max:255'
        ]);

        $validated['user_id'] = $user->id;

        $round->update($validated);

        return response()->json($round);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $user = $request->user();
        $round = Round::where('id', $id)->where('user_id', $user->id)->first();

        if (!$round) {
            return response()->json(['message' => 'Round not found'], 404);
        }

        $round->delete();

        return response()->json(['message' => 'Round deleted successfully.']);
    }

    /**
     * Get list of addresses for a round
     */
    public function getAddresses(Request $request, string $id)
    {
        $user = $request->user();

        // On récupère la tournée de l'utilisateur connecté
        $round = Round::where('id', $id)->where('user_id', $user->id)->first();

        if (!$round) {
            return response()->json(['message' => 'Round not found'], 404);
        }

        // On récupère les adresses liées à cette tournée
        $addresses = $round->addresses()->orderBy('order')->get();

        return response()->json($addresses);
    }

    public function optimize(Request $request, Round $round)
    {
        $user = $request->user();
        if ($round->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Récupère les adresses de la tournée (avec lat/lng)
        $addresses = $round->addresses()->orderBy('order')->get();

        // Construit les "services" (les points à visiter) pour GraphHopper
        $services = [];
        foreach ($addresses as $idx => $address) {
            $services[] = [
                "id" => (string)($address->id),
                "name" => $address->address_text ?? "Address",
                "address" => [
                    "location_id" => (string)($address->id),
                    "lon" => floatval($address->longitude),
                    "lat" => floatval($address->latitude)
                ]
            ];
        }

        // Le véhicule part et arrive au premier point (circuit fermé, adapte si besoin)
        $vehicle = [
            "vehicle_id" => "vehicle_1",
            "start_address" => [
                "location_id" => (string)($addresses[0]->id),
                "lon" => floatval($addresses[0]->longitude),
                "lat" => floatval($addresses[0]->latitude)
            ],
            "end_address" => [
                "location_id" => (string)($addresses[count($addresses) - 1]->id), // dernier point
                "lon" => floatval($addresses[count($addresses) - 1]->longitude),
                "lat" => floatval($addresses[count($addresses) - 1]->latitude)
            ]
        ];

        $body = [
            "vehicles" => [$vehicle],
            "services" => $services,
        ];

        $ghApiKey = env('GRAPHHOPPER_API_KEY');
        $ghUrl = "https://graphhopper.com/api/1/vrp/optimize?key=$ghApiKey";

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ])->post($ghUrl, $body);

        if (!$response->successful()) {
            return response()->json(['message' => 'GraphHopper API failed', 'details' => $response->body()], 500);
        }

        $jobId = $response->json()['job_id'] ?? null;
        if (!$jobId) {
            return response()->json(['message' => 'No job_id returned by GraphHopper.'], 500);
        }

        // GraphHopper fait le calcul asynchrone, il faut donc poller pour récupérer le résultat
        // On peut faire 10 tentatives espacées de 1 seconde (pour du dev, à adapter en prod)
        $solution = null;
        for ($i = 0; $i < 10; $i++) {
            sleep(1); // attends 1 seconde
            $solutionResponse = Http::get("https://graphhopper.com/api/1/vrp/solution/$jobId?key=$ghApiKey");
            $solutionJson = $solutionResponse->json();
            if (!empty($solutionJson['solution']['routes'])) {
                $solution = $solutionJson['solution'];
                break;
            }
        }

        if (!$solution) {
            return response()->json(['message' => 'No solution found from GraphHopper.'], 500);
        }

        // Récupère le nouvel ordre optimal des adresses
        $orderedIds = [];
        foreach ($solution['routes'][0]['activities'] as $activity) {
            if ($activity['type'] === 'service') {
                $orderedIds[] = intval($activity['location_id']);
            }
        }

        // Met à jour l'ordre dans la table pivot
        foreach ($orderedIds as $order => $addressId) {
            $round->addresses()->updateExistingPivot($addressId, ['order' => $order + 1]);
        }
        $orderedAddresses = $round->addresses()->orderBy('address_round.order')->get();

        // Renvoie aussi la géométrie (si besoin) pour l'affichage du tracé
        return response()->json([
            'addresses' => $orderedAddresses,
            'solution' => $solution,
        ]);
    }
}
