<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>GameHub</title>

    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>

<body>

    <div class="app">

        <!-- CABEÇALHO -->

        <header class="header">
            <div>
                <p class="header-small">Bem-vindo</p>
                <h1>GameHub</h1>
            </div>

            <button class="profile-button" onclick="mostrarTela('perfil')">
                <span>👤</span>
            </button>
        </header>


        <!-- CONTEÚDO -->

        <main class="content">

            <!-- TELA INICIAL -->

            <section id="inicio" class="screen active">

                <div class="welcome-card">
                    <div>
                        <span class="card-label">SEU PERFIL</span>
                        <h2>Kisuyu</h2>
                        <p>Nível 5 • 1.250 XP</p>
                    </div>

                    <div class="avatar">
                        👤
                    </div>
                </div>


                <div class="section-header">
                    <h2>Jogadores</h2>

                    <button class="text-button" onclick="mostrarTela('jogadores')">
                        Ver todos
                    </button>
                </div>


                <div id="jogadores-resumo" class="player-list">

                    <div class="player-card">

                        <div class="player-avatar">
                            🧙
                        </div>

                        <div class="player-info">
                            <strong>ShadowKnight</strong>
                            <span>Nível 12 • 4.850 XP</span>
                        </div>

                        <span class="player-platform">
                            PC
                        </span>

                    </div>


                    <div class="player-card">

                        <div class="player-avatar">
                            🧝
                        </div>

                        <div class="player-info">
                            <strong>MoonLight</strong>
                            <span>Nível 8 • 2.400 XP</span>
                        </div>

                        <span class="player-platform">
                            Android
                        </span>

                    </div>

                </div>


                <button class="primary-button" onclick="mostrarTela('cadastro')">
                    + Cadastrar jogador
                </button>

            </section>


            <!-- LISTA DE JOGADORES -->

            <section id="jogadores" class="screen">

                <div class="screen-title">
                    <h2>Jogadores</h2>
                    <p>Jogadores cadastrados no sistema</p>
                    <p id="mensagem-jogadores" role="status"></p>
                </div>

                <div id="lista-jogadores" class="player-list">

                    <div class="player-card">

                        <div class="player-avatar">
                            🧙
                        </div>

                        <div class="player-info">
                            <strong>ShadowKnight</strong>
                            <span>Nível 12 • 4.850 XP</span>
                        </div>

                        <button class="more-button">
                            ⋮
                        </button>

                    </div>


                    <div class="player-card">

                        <div class="player-avatar">
                            🧝
                        </div>

                        <div class="player-info">
                            <strong>MoonLight</strong>
                            <span>Nível 8 • 2.400 XP</span>
                        </div>

                        <button class="more-button">
                            ⋮
                        </button>

                    </div>

                </div>

                <button class="primary-button" onclick="mostrarTela('cadastro')">
                    + Novo jogador
                </button>

            </section>


            <!-- CADASTRO -->

            <section id="cadastro" class="screen">

                <div class="screen-title">
                    <h2>Novo jogador</h2>
                    <p>Cadastre um novo jogador</p>
                </div>


                <form id="form-jogador">

                    <div class="photo-area">

                        <div class="large-avatar">
                            👤
                        </div>

                        <label for="foto_perfil" class="photo-button">
                            Adicionar foto
                        </label>

                        <input
                            type="file"
                            id="foto_perfil"
                            name="foto_perfil"
                            accept="image/*"
                            hidden
                        >

                    </div>


                    <div class="form-group">
                        <label for="nome_usuario">
                            Nome de usuário
                        </label>

                        <input
                            type="text"
                            id="nome_usuario"
                            name="nome_usuario"
                            placeholder="Digite o nome de usuário"
                            required
                        >
                    </div>


                    <div class="form-group">
                        <label for="email">
                            E-mail
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="exemplo@email.com"
                            required
                        >
                    </div>


                    <div class="form-group">
                        <label for="senha">
                            Senha
                        </label>

                        <input
                            type="password"
                            id="senha"
                            name="senha"
                            placeholder="Mínimo de 6 caracteres"
                            required
                        >
                    </div>


                    <div class="form-row">

                        <div class="form-group">
                            <label for="nivel">
                                Nível
                            </label>

                            <input
                                type="number"
                                id="nivel"
                                name="nivel"
                                value="1"
                                min="1"
                                required
                            >
                        </div>


                        <div class="form-group">
                            <label for="xp">
                                XP
                            </label>

                            <input
                                type="number"
                                id="xp"
                                name="xp"
                                value="0"
                                min="0"
                                required
                            >
                        </div>

                    </div>


                    <div class="form-group">
                        <label for="moedas">
                            Moedas
                        </label>

                        <input
                            type="number"
                            id="moedas"
                            name="moedas"
                            value="0"
                            min="0"
                            required
                        >
                    </div>


                    <div class="form-group">
                        <label for="data_nascimento">
                            Data de nascimento
                        </label>

                        <input
                            type="date"
                            id="data_nascimento"
                            name="data_nascimento"
                            required
                        >
                    </div>


                    <div class="form-group">
                        <label for="personagem_favorito">
                            Personagem favorito
                        </label>

                        <input
                            type="text"
                            id="personagem_favorito"
                            name="personagem_favorito"
                            placeholder="Ex.: Guerreiro"
                        >
                    </div>


                    <div class="form-group">
                        <label for="plataforma">
                            Plataforma
                        </label>

                        <select
                            id="plataforma"
                            name="plataforma"
                            required
                        >
                            <option value="">Selecione</option>
                            <option value="Android">Android</option>
                            <option value="iOS">iOS</option>
                            <option value="PC">PC</option>
                            <option value="Console">Console</option>
                        </select>
                    </div>


                    <button
                        type="submit"
                        class="primary-button"
                    >
                        Cadastrar jogador
                    </button>

                    <button
                        id="cancelar-edicao"
                        type="button"
                        class="secondary-button"
                        hidden
                    >
                        Cancelar edição
                    </button>

                </form>

            </section>


            <!-- PERFIL -->

            <section id="perfil" class="screen">

                <div class="screen-title">
                    <h2>Meu perfil</h2>
                    <p>Informações do jogador</p>
                </div>


                <div class="profile-card">

                    <div class="large-avatar">
                        👤
                    </div>

                    <h2>Kisuyu</h2>

                    <p class="profile-email">
                        kisuyu@email.com
                    </p>

                </div>


                <div class="stats">

                    <div class="stat">
                        <strong>5</strong>
                        <span>Nível</span>
                    </div>

                    <div class="stat">
                        <strong>1.250</strong>
                        <span>XP</span>
                    </div>

                    <div class="stat">
                        <strong>500</strong>
                        <span>Moedas</span>
                    </div>

                </div>


                <button
                    class="secondary-button"
                    onclick="mostrarTela('inicio')"
                >
                    Voltar
                </button>

            </section>

        </main>


        <!-- NAVEGAÇÃO INFERIOR -->

        <nav class="bottom-nav">

            <button
                class="nav-item active"
                onclick="mostrarTela('inicio')"
            >
                <span>⌂</span>
                <small>Início</small>
            </button>


            <button
                class="nav-item"
                onclick="mostrarTela('jogadores')"
            >
                <span>👥</span>
                <small>Jogadores</small>
            </button>


            <button
                class="nav-item"
                onclick="mostrarTela('cadastro')"
            >
                <span>＋</span>
                <small>Cadastrar</small>
            </button>


            <button
                class="nav-item"
                onclick="mostrarTela('perfil')"
            >
                <span>👤</span>
                <small>Perfil</small>
            </button>

        </nav>

    </div>


    <script src="{{ asset('js/app.js') }}"></script>

</body>

</html>