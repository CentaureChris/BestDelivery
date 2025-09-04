<?php

namespace App\Http\Controllers\Api;

use App\Models\Round;
use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class RoundController extends Controller
{
    /**
     * Format addresses so that pivot fields (order, delivered)
     * are flattened at top-level for the frontend.
     */
    private function formatAddresses($addresses)
    {
        return $addresses->map(function ($a) {
            return [
                'id'           => $a->id,
                'address_text' => $a->address_text,
                'latitude'     => $a->latitude,
                'longitude'    => $a->longitude,
                // expose pivot fields directly
                'order'        => isset($a->pivot) ? (int) $a->pivot->order : (int) ($a->order ?? 0),
                'delivered'    => isset($a->pivot) ? (bool) $a->pivot->delivered : (bool) ($a->delivered ?? false),
                'comment'      => $a->comments ?? null,
            ];
        })->values();
    }

    /**
     * Recompute and persist the itinerary JSON from current ordered addresses.
     */
    private function refreshItinerary(Round $round): void
    {
        $steps = $round->addresses()
            ->orderBy('address_round.order')
            ->pluck('address_text')
            ->toArray();
        $round->itinerary = json_encode(['steps' => $steps]);
        $round->save();
    }
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
            'itinerary' => 'string|max:255',
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

        // Adresses liées à cette tournée – tri sur l'ordre du pivot
        $addresses = $round->addresses()->orderBy('address_round.order')->get();
        return response()->json($this->formatAddresses($addresses));
    }

    public function optimize(Request $request, Round $round) // Function for GraphHopper
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

        // Le véhicule part d'un point A et arrive au dernier point (circuit ouvert)
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

        // keep itinerary in sync with new order
        $this->refreshItinerary($round);

        // Renvoie aussi la géométrie (si besoin) pour l'affichage du tracé
        return response()->json([
            'addresses' => $this->formatAddresses($orderedAddresses),
            'itinerary' => $round->itinerary,
            'solution'  => $solution,
        ]);
    }

    public function attachAddresses(Request $request, Round $round)
    {
        if ($request->user()->id !== $round->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $payload = $request->all();
        $items = isset($payload['addresses'])
            ? $payload['addresses']
            : [$payload];

        $rules = [
            'address_text' => ['required', 'string', 'max:255'],
            'latitude'     => ['required', 'numeric'],
            'longitude'    => ['required', 'numeric'],
            'order'        => ['nullable', 'integer', 'min:1'],
            'delivered'    => ['nullable', 'boolean'],
        ];

        $attached = [];
        DB::beginTransaction();
        try {
            $currentMax = (int) $round->addresses()->max('address_round.order');
            $nextOrder  = $currentMax > 0 ? $currentMax + 1 : 1;

            foreach ($items as $i => $item) {
                $validated = validator($item, $rules)->validate();
                $validated['delivered'] = $validated['delivered'] ?? false;
                $address = Address::create([
                    'address_text' => $validated['address_text'],
                    'latitude'     => $validated['latitude'],
                    'longitude'    => $validated['longitude'],
                    'order'        => $validated['order'] ?? null,
                    'delivered'    => $validated['delivered'],
                ]);


                $pivotOrder = $validated['order'] ?? $nextOrder++;

                $round->addresses()->syncWithoutDetaching([
                    $address->id => [
                        'order'     => $pivotOrder,
                        'delivered' => $validated['delivered'],
                    ]
                ]);

                $attached[] = $address;
            }

            $this->refreshItinerary($round);

            DB::commit();

            $ordered = $round->addresses()->orderBy('address_round.order')->get();

            return response()->json([
                'message'   => 'Addresses attached successfully.',
                'addresses' => $this->formatAddresses($ordered),
                'itinerary' => $round->itinerary
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to attach addresses.',
                'error'   => $e->getMessage(),
            ], 422);
        }
    }

    public function reorderAddresses(Request $request, Round $round)
    {
        // security
        if ($request->user()->id !== $round->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $ids = $request->input('address_ids', []);
        foreach ($ids as $order => $id) {
            $round->addresses()->updateExistingPivot($id, ['order' => $order + 1]);
        }

        // keep itinerary in sync
        $this->refreshItinerary($round);

        return response()->json([
            'message'   => 'Order updated',
            'itinerary' => $round->itinerary,
        ]);
    }

    public function updateDelivered(Request $request, Round $round, Address $address)
    {
        // security
        if ($request->user()->id !== $round->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $delivered = (bool) $request->input('delivered');
        $round->addresses()->updateExistingPivot($address->id, ['delivered' => $delivered]);

        // keep itinerary in sync (optional, but ensures consistency)
        $this->refreshItinerary($round);

        return response()->json([
            'message'   => 'Delivered status updated',
            'itinerary' => $round->itinerary,
        ]);
    }

    public function updatePivot(Request $request, Round $round, Address $address)
    {
        // security
        if ($request->user()->id !== $round->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'delivered' => ['sometimes', 'boolean'],
            'order'     => ['sometimes', 'integer', 'min:1'],
        ]);

        // ensure address belongs to the round
        if (!$round->addresses()->where('addresses.id', $address->id)->exists()) {
            return response()->json(['message' => 'Address not in this round'], 404);
        }

        // update only provided fields
        $pivotData = [];
        if (array_key_exists('delivered', $data)) $pivotData['delivered'] = $data['delivered'];
        if (array_key_exists('order', $data))     $pivotData['order']     = $data['order'];

        if (!empty($pivotData)) {
            $round->addresses()->updateExistingPivot($address->id, $pivotData);
        }

        // keep itinerary in sync
        $this->refreshItinerary($round);

        // return fresh ordered list
        $addresses = $round->addresses()->orderBy('address_round.order')->get();
        return response()->json([
            'addresses' => $this->formatAddresses($addresses),
            'itinerary' => $round->itinerary,
        ]);
    }
}
