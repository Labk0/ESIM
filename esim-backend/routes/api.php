<?php

use App\Http\Controllers\Api\EsimController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Welcome to the API!']);
});

Route::get('/countries', [EsimController::class, 'getCountries']);

Route::get('/plans/{countryCode}', [EsimController::class, 'getPlans']);

Route::post('/purchase', [EsimController::class, 'purchase']);
