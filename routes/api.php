<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JogadorController;

Route::apiResource('jogadores', JogadorController::class);