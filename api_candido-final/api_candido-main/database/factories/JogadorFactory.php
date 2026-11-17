<?php

namespace Database\Factories;

use App\Models\Jogador;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/** @extends Factory<Jogador> */
class JogadorFactory extends Factory
{
    protected $model = Jogador::class;

    public function definition(): array
    {
        return [
            'nome_usuario' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'senha' => Hash::make('123456'),
            'nivel' => fake()->numberBetween(1, 80),
            'xp' => fake()->numberBetween(0, 20000),
            'moedas' => fake()->numberBetween(0, 5000),
            'data_nascimento' => fake()->dateTimeBetween('-40 years', '-12 years')->format('Y-m-d'),
            'data_criacao_conta' => fake()->dateTimeBetween('-3 years', 'now'),
            'personagem_favorito' => fake()->randomElement(['Link', 'Mario', 'Kratos', 'Lara Croft', 'Sonic', 'Geralt']),
            'plataforma' => fake()->randomElement(['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']),
            'foto_perfil' => null,
        ];
    }
}
