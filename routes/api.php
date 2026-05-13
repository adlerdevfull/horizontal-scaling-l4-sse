<?php
use App\Http\Controllers\Api\V1\{AuthController, EventController};
use Illuminate\Support\Facades\Route;

Route::prefix('v1/auth')->group(function () {
    Route::post('register', [AuthController::class,'register']);
    Route::post('login', [AuthController::class,'login']);
});

Route::get('v1/health', [EventController::class,'health']); // No auth - for LB health checks

Route::prefix('v1')->middleware('auth:api')->group(function () {
    Route::get('auth/me', [AuthController::class,'me']);
    Route::get('events', [EventController::class,'stream']);
    Route::post('events/dispatch', [EventController::class,'dispatch']);
    Route::get('events/recent', [EventController::class,'recent']);
});
