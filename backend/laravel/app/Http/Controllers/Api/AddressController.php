<?php

namespace App\Http\Controllers\Api;

use App\Models\Address;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return Address::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_text' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'order' => 'required|integer',
            'delivered' => 'required|boolean',
            'comments' => 'string|max:255',
        ]);

        $address = Address::create($validated);
        if(!$address){
            return response()->json(['message' => 'error in address creation'],400);
        }
        return response()->json($address, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $address = Address::where('id', $id)->first();
        if (!$address) {
            return response()->json(['message' => 'address not found'], 404);
        }

        return response()->json($address);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $address = Address::find($id);

        if (!$address) {
            return response()->json(['message' => 'address not found'], 404);
        }

        $validated = $request->validate([
            'address_text' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'order' => 'required|integer',
            'delivered' => 'required|boolean',
            'comments' => 'string|max:255'
        ]);

        $address->update($validated);

        return response()->json($address);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $address = Address::where('id', $id)->first();

        if (!$address) {
            return response()->json(['message' => 'address not found'], 404);
        }

        $address->delete();

        return response()->json(['message' => 'address deleted successfully.']);
    }
}
