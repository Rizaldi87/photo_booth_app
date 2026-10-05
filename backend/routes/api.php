<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LayoutController;
use App\Http\Controllers\Api\FrameController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API works!'
    ]);
});
// Auth routes (butuh session + stateful)
Route::middleware(EnsureFrontendRequestsAreStateful::class)->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Public (booth)
Route::get('/layouts/active', [LayoutController::class, 'getActive']);
Route::get('/layouts/{layout}', [LayoutController::class, 'show']);
Route::get('/frames', [FrameController::class, 'index']);
Route::get('/frames/{frame}', [FrameController::class, 'show']);

// Payment routes (public)
Route::post('/payments/create', [PaymentController::class, 'create']);
Route::post('/payments/notification', [PaymentController::class, 'notification']); // webhook Midtrans - public
Route::get('/payments/{orderId}/status', [PaymentController::class, 'status']);

// Protected - Admin & Operator (stateful + auth + role)
Route::middleware([
    EnsureFrontendRequestsAreStateful::class,
    'auth:sanctum',
    'role:admin,operator'
])->group(function () {
    Route::apiResource('layouts', LayoutController::class)->except(['show']);
    Route::apiResource('frames', FrameController::class)->except(['show']);
});
