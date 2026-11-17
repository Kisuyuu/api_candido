<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view()->file(base_path('views/app.blade.php'));
});