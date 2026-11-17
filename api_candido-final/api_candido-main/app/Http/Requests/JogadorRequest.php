<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JogadorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');
        $criando = $id === null;

        return [
            'nome_usuario' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:jogadores,email' . ($id ? ',' . $id : '')],
            'senha' => [$criando ? 'required' : 'nullable', 'string', 'min:6'],
            'nivel' => ['required', 'integer', 'min:1'],
            'xp' => ['required', 'integer', 'min:0'],
            'moedas' => ['required', 'integer', 'min:0'],
            'data_nascimento' => ['required', 'date', 'before:today'],
            'data_criacao_conta' => ['sometimes', 'date'],
            'personagem_favorito' => ['nullable', 'string', 'max:255'],
            'plataforma' => ['required', 'string', 'max:255'],
            'foto_perfil' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nome_usuario' => 'nome de usuário',
            'email' => 'e-mail',
            'senha' => 'senha',
            'nivel' => 'nível',
            'xp' => 'XP',
            'moedas' => 'moedas',
            'data_nascimento' => 'data de nascimento',
            'personagem_favorito' => 'personagem favorito',
            'plataforma' => 'plataforma',
            'foto_perfil' => 'foto de perfil',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser um texto.',
            'email' => 'Informe um e-mail válido.',
            'unique' => 'Este :attribute já está cadastrado.',
            'integer' => 'O campo :attribute deve ser um número inteiro.',
            'min.numeric' => 'O campo :attribute deve ser no mínimo :min.',
            'min.string' => 'O campo :attribute deve ter no mínimo :min caracteres.',
            'max.string' => 'O campo :attribute deve ter no máximo :max caracteres.',
            'date' => 'O campo :attribute deve ser uma data válida.',
            'before' => 'A :attribute deve ser anterior a hoje.',
            'image' => 'O arquivo enviado deve ser uma imagem.',
            'mimes' => 'A imagem deve ser JPG, PNG ou WEBP.',
            'foto_perfil.max' => 'A foto deve ter no máximo 5 MB.',
        ];
    }
}
