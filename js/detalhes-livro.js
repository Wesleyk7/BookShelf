async function carregarDetalhesLivro() {

    try {

        /* ===================================
           PEGAR ID DA URL
        =================================== */

        const parametros =
            new URLSearchParams(
                window.location.search
            );

        const idLivro =
            parametros.get("id");


        if (!idLivro) {

            alert(
                "Livro não encontrado."
            );

            window.location.href =
                "livros.html";

            return;

        }


        /* ===================================
           CARREGAR LIVROS DA API
        =================================== */

        const respostaLivros =
            await fetch(
                "http://localhost:3000/api/livros"
            );


        if (!respostaLivros.ok) {

            throw new Error(
                "Erro ao buscar livros."
            );

        }


        const livros =
            await respostaLivros.json();


        const livro =
            livros.find(
                item =>
                    item.id === idLivro
            );


        if (!livro) {

            alert(
                "Livro não encontrado."
            );

            window.location.href =
                "livros.html";

            return;

        }


        /* ===================================
           CARREGAR EMPRÉSTIMOS DA API
        =================================== */

        const respostaEmprestimos =
            await fetch(
                "http://localhost:3000/api/emprestimos"
            );


        if (!respostaEmprestimos.ok) {

            throw new Error(
                "Erro ao buscar empréstimos."
            );

        }


        const emprestimos =
            await respostaEmprestimos.json();


        /* ===================================
           VERIFICAR EMPRÉSTIMO ATIVO
        =================================== */

        const emprestimoAtivo =
            emprestimos.find(
                emprestimo =>
                    emprestimo.livro_id ===
                        livro.id

                    &&

                    (
                        emprestimo.status ===
                            "Emprestado"

                        ||

                        emprestimo.status ===
                            "Atrasado"
                    )
            );


        let statusAtual =
            livro.status;


        if (emprestimoAtivo) {

            statusAtual =
                emprestimoAtivo.status;

        }


        /* ===================================
           MOSTRAR INFORMAÇÕES
        =================================== */

        document.getElementById(
            "detalhe-titulo"
        ).textContent =
            livro.titulo;


        document.getElementById(
            "detalhe-autor"
        ).textContent =
            livro.autor;


        document.getElementById(
            "detalhe-genero"
        ).textContent =
            livro.genero;


        document.getElementById(
            "detalhe-estante"
        ).textContent =
            livro.estante;


        document.getElementById(
            "detalhe-prateleira"
        ).textContent =
            livro.prateleira;


        document.getElementById(
            "detalhe-id"
        ).textContent =
            livro.id;


        /* ===================================
           DESCRIÇÃO
        =================================== */

        const descricao =
            document.getElementById(
                "detalhe-descricao"
            );


        if (livro.descricao) {

            descricao.textContent =
                livro.descricao;

        }


        /* ===================================
           STATUS
        =================================== */

        const status =
            document.getElementById(
                "detalhe-status"
            );


        status.textContent =
            statusAtual;


        status.className =
            "status " +
            classeStatus(
                statusAtual
            );


        /* ===================================
           BOTÃO DE EMPRÉSTIMO
        =================================== */

        const botaoEmprestimo =
            document.getElementById(
                "botao-emprestimo"
            );


        if (emprestimoAtivo) {

            botaoEmprestimo.textContent =
                "Livro indisponível";


            botaoEmprestimo.removeAttribute(
                "href"
            );


            botaoEmprestimo.style.opacity =
                "0.6";


            botaoEmprestimo.style.cursor =
                "not-allowed";

        } else {

            botaoEmprestimo.textContent =
                "Registrar empréstimo";


            botaoEmprestimo.href =
                `novo-emprestimo.html?id=${livro.id}`;


            botaoEmprestimo.style.opacity =
                "1";


            botaoEmprestimo.style.cursor =
                "pointer";

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar detalhes:",
            erro
        );


        alert(
            "Não foi possível carregar os detalhes do livro."
        );

    }

}


/* ===================================
   CLASSE DO STATUS
=================================== */

function classeStatus(status) {

    if (
        status === "Disponível"
    ) {

        return "disponivel";

    }


    if (
        status === "Emprestado"
    ) {

        return "emprestado";

    }


    if (
        status === "Atrasado"
    ) {

        return "atrasado";

    }


    if (
        status === "Atenção"
    ) {

        return "atencao";

    }


    if (
        status === "Reabastecer"
    ) {

        return "reabastecer";

    }


    if (
        status === "Saída"
    ) {

        return "emprestado";

    }


    if (
        status === "Erro"
    ) {

        return "erro";

    }


    return "";

}


/* ===================================
   INICIAR
=================================== */

carregarDetalhesLivro();