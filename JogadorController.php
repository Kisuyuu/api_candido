<?php

namespace App\Http\Controllers;

use App\Models\Jogador;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class JogadorController extends Controller
{
    public function index()
    {
        $jogadores = Jogador::all();

        return response()->json($jogadores);
    }

    public function store(Request $request)
    {
        $dados = $request->validate([
            'nome_usuario' => 'required|string|max:255',
            'email' => 'required|email|unique:jogadores,email',
            'senha' => 'required|string|min:6',

            'nivel' => 'required|integer|min:1',
            'xp' => 'required|integer|min:0',
            'moedas' => 'required|integer|min:0',

            'data_nascimento' => 'required|date',
            'data_criacao_conta' => 'required|date',

            'personagem_favorito' => 'nullable|string|max:255',
            'plataforma' => 'required|string|max:255',

            'foto_perfil' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $dados['senha'] = Hash::make($dados['senha']);

        if ($request->hasFile('foto_perfil')) {
            $dados['foto_perfil'] = $request
                ->file('foto_perfil')
                ->store('fotos-jogadores', 'public');
        }

        $jogador = Jogador::create($dados);

        return response()->json($jogador, 201);
    }

    public function show(string $id)
    {
        $jogador = Jogador::findOrFail($id);

        return response()->json($jogador);
    }

    public function update(Request $request, string $id)
    {
        $jogador = Jogador::findOrFail($id);

        $dados = $request->validate([
            'nome_usuario' => 'sometimes|string|max:255',

            'email' => 'sometimes|email|unique:jogadores,email,' . $jogador->id,

            'senha' => 'sometimes|string|min:6',

            'nivel' => 'sometimes|integer|min:1',
            'xp' => 'sometimes|integer|min:0',
            'moedas' => 'sometimes|integer|min:0',

            'data_nascimento' => 'sometimes|date',
            'data_criacao_conta' => 'sometimes|date',

            'personagem_favorito' => 'sometimes|nullable|string|max:255',
            'plataforma' => 'sometimes|string|max:255',

            'foto_perfil' => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if (isset($dados['senha'])) {
            $dados['senha'] = Hash::make($dados['senha']);
        }

        if ($request->hasFile('foto_perfil')) {

            if ($jogador->foto_perfil) {
                Storage::disk('public')->delete($jogador->foto_perfil);
            }

            $dados['foto_perfil'] = $request
                ->file('foto_perfil')
                ->store('fotos-jogadores', 'public');
        }

        $jogador->update($dados);

        return response()->json($jogador);
    }

    public function destroy(string $id)
    {
        $jogador = Jogador::findOrFail($id);

        if ($jogador->foto_perfil) {
            Storage::disk('public')->delete($jogador->foto_perfil);
        }

        $jogador->delete();

        return response()->json([
            'mensagem' => 'Jogador excluído com sucesso.'
        ]);
    }
}