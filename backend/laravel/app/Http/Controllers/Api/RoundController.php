<?php

namespace App\Http\Controllers\Api;

use App\Models\Round;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

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
}
