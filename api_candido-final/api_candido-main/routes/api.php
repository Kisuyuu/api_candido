<?php

use App\Http\Controllers\JogadorController;
use Illuminate\Support\Facades\Route;

Route::apiResource('jogadores', JogadorController::class)
    ->parameters(['jogadores' => 'id']);
