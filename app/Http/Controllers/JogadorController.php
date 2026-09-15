<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Jogador;
use Illuminate\Support\Facades\Hash;

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
        'data_criacao_conta' => 'required|date',
        'personagem_favorito' => 'nullable|string|max:255',
        'plataforma' => 'required|string|max:255',
    ]);

    $dados['senha'] = Hash::make($dados['senha']);

    $jogador = Jogador::create($dados);

    return response()->json($jogador, 201);
}

    /**
     * Display the specified resource.
     */
    public function show(string $id)
{
    $jogador = Jogador::find($id);

    return response()->json($jogador);
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $jogador = Jogador::find($id);
    
        $jogador->update($request->all());
    
        return response()->json($jogador);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jogador = Jogador::find($id);
    
        $jogador->delete();
    
        return response()->json([
            'mensagem' => 'Jogador excluído com sucesso.'
        ]);
    }
}