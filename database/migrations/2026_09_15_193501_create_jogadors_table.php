<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jogadores', function (Blueprint $table) {
            $table->id();
        
            $table->string('nome_usuario');
            $table->string('email')->unique();
            $table->string('senha');
        
            $table->integer('nivel')->default(1);
            $table->integer('xp')->default(0);
            $table->integer('moedas')->default(0);
        
            $table->date('data_nascimento');
            $table->dateTime('data_criacao_conta');
        
            $table->string('personagem_favorito')->nullable();
            $table->string('plataforma');
        
            $table->string('foto_perfil')->nullable();
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jogadors');
    }
};
