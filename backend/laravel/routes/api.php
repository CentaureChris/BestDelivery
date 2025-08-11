<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RoundController;
use App\Http\Controllers\Api\AddressController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('rounds', RoundController::class);
    Route::apiResource('addresses', AddressController::class);
    Route::get('rounds/{id}/addresses', [RoundController::class, 'getAddresses']);
    Route::post('rounds/{round}/addresses', [RoundController::class, 'attachAddresses']);
    Route::post('rounds/{round}/optimize', [RoundController::class, 'optimize']);
    Route::patch('rounds/{round}/addresses/reorder', [RoundController::class, 'reorderAddresses']);
    Route::patch('rounds/{round}/addresses/{address}', [RoundController::class, 'updatePivot']);
    Route::patch('rounds/{round}/addresses/{address}/delivered', [RoundController::class, 'updateDelivered'])->whereNumber('round')->whereNumber('address');
});
