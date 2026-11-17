<?php

namespace Database\Seeders;

use App\Models\Jogador;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Jogador::factory()->count(8)->create();
    }
}
