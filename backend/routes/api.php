<?php
use App\Http\Controllers\Api\LayoutController;
use App\Http\Controllers\Api\FrameController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API works!'
    ]);
});

Route::get('/layouts/active', [LayoutController::class, 'getActive']);
Route::apiResource('layouts', LayoutController::class);
Route::apiResource('frames', FrameController::class);
