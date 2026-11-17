<?php

namespace Tests\Feature;

use App\Models\Jogador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class JogadorApiTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $extra = []): array
    {
        return array_merge([
            'nome_usuario' => 'Kisuyu',
            'email' => 'kisuyu@example.com',
            'senha' => '123456',
            'nivel' => 5,
            'xp' => 1250,
            'moedas' => 300,
            'data_nascimento' => '2000-05-10',
            'personagem_favorito' => 'Link',
            'plataforma' => 'PC',
        ], $extra);
    }

    public function test_cria_jogador_com_foto(): void
    {
        Storage::fake('public');

        $resposta = $this->postJson('/api/jogadores', $this->payload([
            'foto_perfil' => UploadedFile::fake()->image('foto.jpg'),
        ]));

        $resposta->assertCreated()->assertJsonMissing(['senha']);
        Storage::disk('public')->assertExists($resposta->json('foto_perfil'));
    }

    public function test_valida_campos_obrigatorios(): void
    {
        $this->postJson('/api/jogadores', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['nome_usuario', 'email', 'senha', 'nivel', 'xp', 'moedas', 'data_nascimento', 'plataforma']);
    }

    public function test_lista_e_mostra_jogador(): void
    {
        $jogador = Jogador::factory()->create();

        $this->getJson('/api/jogadores')->assertOk()->assertJsonCount(1);
        $this->getJson("/api/jogadores/{$jogador->id}")->assertOk()->assertJsonPath('id', $jogador->id);
    }

    public function test_atualiza_jogador_sem_trocar_senha(): void
    {
        $jogador = Jogador::factory()->create();
        $hash = $jogador->senha;

        $this->putJson("/api/jogadores/{$jogador->id}", $this->payload(['senha' => '', 'email' => $jogador->email]))
            ->assertOk()
            ->assertJsonPath('nome_usuario', 'Kisuyu');

        $this->assertSame($hash, $jogador->fresh()->senha);
    }

    public function test_exclui_jogador_e_foto(): void
    {
        Storage::fake('public');
        $caminho = UploadedFile::fake()->image('x.jpg')->store('fotos-jogadores', 'public');
        $jogador = Jogador::factory()->create(['foto_perfil' => $caminho]);

        $this->deleteJson("/api/jogadores/{$jogador->id}")->assertOk();

        $this->assertDatabaseMissing('jogadores', ['id' => $jogador->id]);
        Storage::disk('public')->assertMissing($caminho);
    }
}
