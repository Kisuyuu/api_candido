<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jogador;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class JogadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jogadores = Jogador::all();

        return response()->json($jogadores);
    }

    /**
     * Store a newly created resource in storage.
     */
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
            'data_criacao_conta' => 'sometimes|date',
            'personagem_favorito' => 'nullable|string|max:255',
            'plataforma' => 'required|string|max:255',
            'foto_perfil' => 'nullable|image|max:2048',
        ]);

        $dados['senha'] = Hash::make($dados['senha']);
        $dados['data_criacao_conta'] ??= now();

        if ($request->hasFile('foto_perfil')) {
            $dados['foto_perfil'] = $request->file('foto_perfil')->store('jogadores', 'public');
        }

        $jogador = Jogador::create($dados);

        return response()->json($jogador, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jogador = Jogador::findOrFail($id);

        return response()->json($jogador);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $jogador = Jogador::findOrFail($id);

        $dados = $request->validate([
            'nome_usuario' => 'required|string|max:255',
            'email' => 'required|email|unique:jogadores,email,' . $jogador->id,
            'senha' => 'nullable|string|min:6',
            'nivel' => 'required|integer|min:1',
            'xp' => 'required|integer|min:0',
            'moedas' => 'required|integer|min:0',
            'data_nascimento' => 'required|date',
            'personagem_favorito' => 'nullable|string|max:255',
            'plataforma' => 'required|string|max:255',
            'foto_perfil' => 'nullable|image|max:2048',
        ]);

        if (! $request->filled('senha')) {
            unset($dados['senha']);
        } else {
            $dados['senha'] = Hash::make($dados['senha']);
        }

        if ($request->hasFile('foto_perfil')) {
            if ($jogador->foto_perfil) {
                Storage::disk('public')->delete($jogador->foto_perfil);
            }

            $dados['foto_perfil'] = $request->file('foto_perfil')->store('jogadores', 'public');
        }

        $jogador->update($dados);

        return response()->json($jogador->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
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