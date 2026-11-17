<?php

namespace App\Http\Controllers;

use App\Http\Requests\JogadorRequest;
use App\Models\Jogador;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class JogadorController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Jogador::orderBy('nome_usuario')->get());
    }

    public function store(JogadorRequest $request): JsonResponse
    {
        $dados = $request->validated();

        $dados['senha'] = Hash::make($dados['senha']);
        $dados['data_criacao_conta'] ??= now();

        if ($request->hasFile('foto_perfil')) {
            $dados['foto_perfil'] = $request->file('foto_perfil')->store('fotos-jogadores', 'public');
        }

        return response()->json(Jogador::create($dados), 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(Jogador::findOrFail($id));
    }

    public function update(JogadorRequest $request, string $id): JsonResponse
    {
        $jogador = Jogador::findOrFail($id);
        $dados = $request->validated();

        if (empty($dados['senha'])) {
            unset($dados['senha']);
        } else {
            $dados['senha'] = Hash::make($dados['senha']);
        }

        if ($request->hasFile('foto_perfil')) {
            if ($jogador->foto_perfil) {
                Storage::disk('public')->delete($jogador->foto_perfil);
            }
            $dados['foto_perfil'] = $request->file('foto_perfil')->store('fotos-jogadores', 'public');
        } else {
            unset($dados['foto_perfil']);
        }

        $jogador->update($dados);

        return response()->json($jogador->fresh());
    }

    public function destroy(string $id): JsonResponse
    {
        $jogador = Jogador::findOrFail($id);

        if ($jogador->foto_perfil) {
            Storage::disk('public')->delete($jogador->foto_perfil);
        }

        $jogador->delete();

        return response()->json(['mensagem' => 'Jogador excluído com sucesso.']);
    }
}
