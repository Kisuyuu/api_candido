<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Jogador extends Model
{
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
}