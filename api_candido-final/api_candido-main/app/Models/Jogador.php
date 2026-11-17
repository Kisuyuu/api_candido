<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jogador extends Model
{
    use HasFactory;

    protected $table = 'jogadores';

    protected $fillable = [
        'nome_usuario',
        'email',
        'senha',
        'nivel',
        'xp',
        'moedas',
        'data_nascimento',
        'data_criacao_conta',
        'personagem_favorito',
        'plataforma',
        'foto_perfil',
    ];

    protected $hidden = [
        'senha',
    ];

    protected $casts = [
        'nivel' => 'integer',
        'xp' => 'integer',
        'moedas' => 'integer',
        'data_nascimento' => 'date:Y-m-d',
        'data_criacao_conta' => 'datetime',
    ];
}
