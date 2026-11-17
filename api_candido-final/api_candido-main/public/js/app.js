function mostrarTela(nomeTela) {

    const telas = document.querySelectorAll('.screen');

    telas.forEach(function (tela) {
        tela.classList.remove('active');
    });


    const telaSelecionada = document.getElementById(nomeTela);

    if (telaSelecionada) {
        telaSelecionada.classList.add('active');
    }

    if (nomeTela === 'cadastro' && formulario && !formulario.dataset.editingId) {
        prepararFormularioCriacao();
    }


    const botoes = document.querySelectorAll('.nav-item');

    botoes.forEach(function (botao) {
        botao.classList.remove('active');
    });


    const mapaBotoes = {
        inicio: 0,
        jogadores: 1,
        cadastro: 2,
        perfil: 3
    };


    if (mapaBotoes[nomeTela] !== undefined) {

        botoes[mapaBotoes[nomeTela]]
            .classList.add('active');
    }


    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/* FORMULÁRIO */

const formulario = document.getElementById('form-jogador');
const listaJogadores = document.getElementById('lista-jogadores');
const jogadoresResumo = document.getElementById('jogadores-resumo');

function mostrarMensagemFormulario(mensagem, tipo) {
    let elemento = document.getElementById('mensagem-formulario');

    if (!elemento) {
        elemento = document.createElement('p');
        elemento.id = 'mensagem-formulario';
        formulario.prepend(elemento);
    }

    elemento.textContent = mensagem;
    elemento.className = tipo;
}

function criarCartaoJogador(jogador, incluirMenu) {
    const cartao = document.createElement('div');
    cartao.className = 'player-card';

    const avatar = document.createElement('div');
    avatar.className = 'player-avatar';
    avatar.textContent = '👤';

    const informacoes = document.createElement('div');
    informacoes.className = 'player-info';

    const nome = document.createElement('strong');
    nome.textContent = jogador.nome_usuario;

    const detalhes = document.createElement('span');
    detalhes.textContent = `Nível ${jogador.nivel} • ${jogador.xp} XP`;

    informacoes.append(nome, detalhes);
    cartao.append(avatar, informacoes);

    if (incluirMenu) {
        const editar = document.createElement('button');
        editar.className = 'more-button';
        editar.type = 'button';
        editar.title = `Editar ${jogador.nome_usuario}`;
        editar.setAttribute('aria-label', `Editar ${jogador.nome_usuario}`);
        editar.textContent = '✎';
        editar.addEventListener('click', function () {
            editarJogador(jogador.id);
        });

        const excluir = document.createElement('button');
        excluir.className = 'more-button';
        excluir.type = 'button';
        excluir.title = `Excluir ${jogador.nome_usuario}`;
        excluir.setAttribute('aria-label', `Excluir ${jogador.nome_usuario}`);
        excluir.textContent = '×';
        excluir.addEventListener('click', function () {
            excluirJogador(jogador.id, jogador.nome_usuario);
        });

        cartao.append(editar, excluir);
    } else {
        const plataforma = document.createElement('span');
        plataforma.className = 'player-platform';
        plataforma.textContent = jogador.plataforma;
        cartao.append(plataforma);
    }

    return cartao;
}

async function carregarJogadores() {
    const resposta = await fetch('/api/jogadores', { cache: 'no-store' });

    if (!resposta.ok) {
        throw new Error('Não foi possível carregar a lista de jogadores.');
    }

    const jogadores = await resposta.json();
    listaJogadores.replaceChildren();
    jogadoresResumo.replaceChildren();

    jogadores.forEach(function (jogador) {
        listaJogadores.append(criarCartaoJogador(jogador, true));
        jogadoresResumo.append(criarCartaoJogador(jogador, false));
    });
}

function mostrarMensagemLista(mensagem, tipo) {
    const elemento = document.getElementById('mensagem-jogadores');

    elemento.textContent = mensagem;
    elemento.className = tipo;
}

async function obterMensagemErro(resposta) {
    const dados = await resposta.json().catch(function () {
        return {};
    });

    if (dados.errors) {
        return Object.values(dados.errors).flat().join(' ');
    }

    return dados.message || 'Não foi possível concluir a operação.';
}

function prepararFormularioCriacao() {
    formulario.reset();
    delete formulario.dataset.editingId;
    formulario.querySelector('#senha').required = true;
    formulario.querySelector('button[type="submit"]').textContent = 'Cadastrar jogador';
    document.querySelector('#cadastro .screen-title h2').textContent = 'Novo jogador';
    document.querySelector('#cadastro .screen-title p').textContent = 'Cadastre um novo jogador';
    document.getElementById('cancelar-edicao').hidden = true;
    mostrarMensagemFormulario('', '');
}

async function editarJogador(id) {
    try {
        const resposta = await fetch(`/api/jogadores/${id}`, { cache: 'no-store' });

        if (!resposta.ok) {
            throw new Error(await obterMensagemErro(resposta));
        }

        const jogador = await resposta.json();
        formulario.dataset.editingId = jogador.id;
        formulario.querySelector('#nome_usuario').value = jogador.nome_usuario || '';
        formulario.querySelector('#email').value = jogador.email || '';
        formulario.querySelector('#senha').value = '';
        formulario.querySelector('#senha').required = false;
        formulario.querySelector('#nivel').value = jogador.nivel;
        formulario.querySelector('#xp').value = jogador.xp;
        formulario.querySelector('#moedas').value = jogador.moedas;
        formulario.querySelector('#data_nascimento').value = jogador.data_nascimento
            ? jogador.data_nascimento.slice(0, 10)
            : '';
        formulario.querySelector('#personagem_favorito').value = jogador.personagem_favorito || '';
        formulario.querySelector('#plataforma').value = jogador.plataforma || '';
        formulario.querySelector('#foto_perfil').value = '';
        formulario.querySelector('button[type="submit"]').textContent = 'Salvar alterações';
        document.querySelector('#cadastro .screen-title h2').textContent = 'Editar jogador';
        document.querySelector('#cadastro .screen-title p').textContent = 'Atualize os dados do jogador';
        document.getElementById('cancelar-edicao').hidden = false;
        mostrarMensagemFormulario('', '');
        mostrarTela('cadastro');
    } catch (erro) {
        mostrarMensagemLista(erro.message, 'erro');
    }
}

async function excluirJogador(id, nome) {
    if (!window.confirm(`Deseja excluir o jogador "${nome}"?`)) {
        return;
    }

    try {
        const resposta = await fetch(`/api/jogadores/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error(await obterMensagemErro(resposta));
        }

        await carregarJogadores();
        mostrarMensagemLista('Jogador excluído com sucesso.', 'sucesso');
    } catch (erro) {
        mostrarMensagemLista(erro.message, 'erro');
    }
}

if (formulario) {
    document.getElementById('cancelar-edicao').addEventListener('click', function () {
        prepararFormularioCriacao();
        mostrarTela('jogadores');
    });

    formulario.addEventListener('submit', async function (event) {
        event.preventDefault();

        const botao = formulario.querySelector('button[type="submit"]');
        const textoOriginal = botao.textContent;
        const editando = Boolean(formulario.dataset.editingId);
        const dados = new FormData(formulario);
        let url = '/api/jogadores';

        if (editando) {
            url = `/api/jogadores/${formulario.dataset.editingId}`;
            dados.append('_method', 'PUT');

            if (!dados.get('senha')) {
                dados.delete('senha');
            }
        }

        botao.disabled = true;
        botao.textContent = editando ? 'Salvando...' : 'Cadastrando...';
        mostrarMensagemFormulario('', '');

        try {
            const resposta = await fetch(url, {
                method: 'POST',
                body: dados
            });

            if (!resposta.ok) {
                throw new Error(await obterMensagemErro(resposta));
            }

            prepararFormularioCriacao();
            await carregarJogadores();
            mostrarMensagemLista(
                editando ? 'Jogador atualizado com sucesso.' : 'Jogador cadastrado com sucesso.',
                'sucesso'
            );
            mostrarTela('jogadores');
        } catch (erro) {
            mostrarMensagemFormulario(erro.message, 'erro');
        } finally {
            botao.disabled = false;
            botao.textContent = textoOriginal;
        }
    });
}

carregarJogadores().catch(function (erro) {
    if (listaJogadores) {
        listaJogadores.textContent = erro.message;
    }
});


/* FOTO */

const inputFoto = document.getElementById('foto_perfil');


if (inputFoto) {

    inputFoto.addEventListener('change', function () {

        if (inputFoto.files.length > 0) {

            const arquivo = inputFoto.files[0];

            console.log(
                'Foto selecionada:',
                arquivo.name
            );
        }
    });
}