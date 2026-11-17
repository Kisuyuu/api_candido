function mostrarTela(nomeTela) {

    const telas = document.querySelectorAll('.screen');

    telas.forEach(function (tela) {
        tela.classList.remove('active');
    });


    const telaSelecionada = document.getElementById(nomeTela);

    if (telaSelecionada) {
        telaSelecionada.classList.add('active');
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


if (formulario) {

    formulario.addEventListener('submit', function (event) {

        event.preventDefault();


        const nome = document.getElementById('nome_usuario').value;


        alert(
            'Jogador "' +
            nome +
            '" preparado para ser cadastrado!'
        );


        formulario.reset();


        mostrarTela('jogadores');
    });
}


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