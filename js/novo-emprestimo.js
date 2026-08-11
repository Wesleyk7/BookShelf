let livroSelecionado = null;


/* ================================
   CARREGAR LIVRO SELECIONADO
================================ */

async function carregarLivroSelecionado() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const idLivro =
        parametros.get("id");


    if (!idLivro) {

        alert(
            "Nenhum livro foi selecionado."
        );

        window.location.href =
            "livros.html";

        return;

    }


    try {

        const resposta =
            await fetch(
                "http://localhost:3000/api/livros"
            );

        const livros =
            await resposta.json();


        livroSelecionado =
            livros.find(
                livro =>
                    livro.id === idLivro
            );


        if (!livroSelecionado) {

            alert(
                "Livro não encontrado."
            );

            window.location.href =
                "livros.html";

            return;

        }


        document.getElementById(
            "nome-livro"
        ).textContent =
            livroSelecionado.titulo;


        document.getElementById(
            "autor-livro"
        ).textContent =
            livroSelecionado.autor;


        document.getElementById(
            "codigo-livro"
        ).textContent =
            livroSelecionado.id;


        preencherDatas();


    } catch (erro) {

        console.error(
            "Erro ao carregar livro:",
            erro
        );

    }

}


/* ================================
   DATA AUTOMÁTICA
================================ */

function preencherDatas() {

    const hoje =
        new Date();


    const dataRetirada =
        hoje
            .toISOString()
            .split("T")[0];


    const devolucao =
        new Date();


    devolucao.setDate(
        devolucao.getDate() + 14
    );


    const dataPrevista =
        devolucao
            .toISOString()
            .split("T")[0];


    document.getElementById(
        "data-retirada"
    ).value =
        dataRetirada;


    document.getElementById(
        "data-prevista"
    ).value =
        dataPrevista;

}


/* ================================
   SALVAR EMPRÉSTIMO NO MYSQL
================================ */

document
    .getElementById(
        "form-emprestimo"
    )
    .addEventListener(
        "submit",
        async function(evento) {

            evento.preventDefault();


            if (!livroSelecionado) {

                alert(
                    "Livro não carregado."
                );

                return;

            }


            const responsavel =
                document
                    .getElementById(
                        "responsavel"
                    )
                    .value
                    .trim();


            const dataRetirada =
                document
                    .getElementById(
                        "data-retirada"
                    )
                    .value;


            const dataPrevista =
                document
                    .getElementById(
                        "data-prevista"
                    )
                    .value;


            const observacoes =
                document
                    .getElementById(
                        "observacoes"
                    )
                    .value
                    .trim();


            if (
                responsavel === ""
            ) {

                alert(
                    "Informe o nome do responsável."
                );

                return;

            }


            if (
                !dataRetirada
                ||
                !dataPrevista
            ) {

                alert(
                    "Preencha as datas do empréstimo."
                );

                return;

            }


            if (
                dataPrevista <
                dataRetirada
            ) {

                alert(
                    "A data prevista de devolução não pode ser anterior à data de retirada."
                );

                return;

            }


            try {

                const resposta =
                    await fetch(
                        "http://localhost:3000/api/emprestimos",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    livroId:
                                        livroSelecionado.id,

                                    responsavel:
                                        responsavel,

                                    dataRetirada:
                                        dataRetirada,

                                    dataPrevista:
                                        dataPrevista,

                                    observacoes:
                                        observacoes
                                })
                        }
                    );


                const resultado =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        resultado.mensagem
                        ||
                        "Erro ao registrar empréstimo."
                    );

                    return;

                }


                alert(
                    resultado.mensagem
                );


                window.location.href =
                    "emprestimos.html";


            } catch (erro) {

                console.error(
                    "Erro ao registrar empréstimo:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }
    );


/* ================================
   INICIAR
================================ */

carregarLivroSelecionado();