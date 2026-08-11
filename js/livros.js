let todosOsLivros = [];
let emprestimos = [];


/* ===================================
   CARREGAR LIVROS E EMPRÉSTIMOS
=================================== */

async function carregarLivros() {

    try {

        /* ================================
           LIVROS
        ================================ */

        const respostaLivros =
            await fetch(
                "http://localhost:3000/api/livros"
            );


        if (!respostaLivros.ok) {

            throw new Error(
                "Erro ao buscar livros."
            );

        }


        todosOsLivros =
            await respostaLivros.json();



        /* ================================
           EMPRÉSTIMOS
        ================================ */

        const respostaEmprestimos =
            await fetch(
                "http://localhost:3000/api/emprestimos"
            );


        if (!respostaEmprestimos.ok) {

            throw new Error(
                "Erro ao buscar empréstimos."
            );

        }


        emprestimos =
            await respostaEmprestimos.json();



        /* ================================
           MOSTRAR LIVROS
        ================================ */

        mostrarLivros(
            todosOsLivros
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar os livros:",
            erro
        );


        const container =
            document.getElementById(
                "lista-livros"
            );


        container.innerHTML = `
            <p>
                Não foi possível carregar os livros.
                Verifique se o backend está ligado.
            </p>
        `;

    }

}


/* ===================================
   STATUS REAL DO LIVRO
=================================== */

function obterStatusLivro(
    livro
) {

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


    if (emprestimoAtivo) {

        return emprestimoAtivo.status;

    }


    return livro.status;

}


/* ===================================
   MOSTRAR LIVROS
=================================== */

function mostrarLivros(
    lista
) {

    const container =
        document.getElementById(
            "lista-livros"
        );


    container.innerHTML = "";


    if (
        lista.length === 0
    ) {

        container.innerHTML = `
            <p>
                Nenhum livro encontrado.
            </p>
        `;

        return;

    }


    lista.forEach(
        livro => {

            const statusAtual =
                obterStatusLivro(
                    livro
                );


            const card =
                document.createElement(
                    "article"
                );


            card.classList.add(
                "card-livro"
            );


            card.addEventListener(
                "click",
                () => {

                    window.location.href =
                        `detalhes-livro.html?id=${livro.id}`;

                }
            );


            card.innerHTML = `

                <div class="capa-livro">
                    📚
                </div>

                <div class="info-livro">

                    <span
                        class="status ${classeStatus(
                            statusAtual
                        )}"
                    >
                        ${statusAtual}
                    </span>


                    <h3>
                        ${livro.titulo}
                    </h3>


                    <p>
                        ${livro.autor}
                    </p>


                    <small>
                        ${livro.genero}
                    </small>


                    <div class="localizacao">

                        Estante ${livro.estante}

                        •

                        Prateleira ${livro.prateleira}

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* ===================================
   CLASSE DO STATUS
=================================== */

function classeStatus(
    status
) {

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
   FILTRAR LIVROS
=================================== */

function filtrarLivros() {

    const pesquisa =
        document
            .getElementById(
                "pesquisa-livro"
            )
            .value
            .toLowerCase();


    const genero =
        document
            .getElementById(
                "filtro-genero"
            )
            .value;


    const status =
        document
            .getElementById(
                "filtro-status"
            )
            .value;


    const resultado =
        todosOsLivros.filter(
            livro => {

                const statusAtual =
                    obterStatusLivro(
                        livro
                    );


                const correspondePesquisa =

                    livro.titulo
                        .toLowerCase()
                        .includes(
                            pesquisa
                        )

                    ||

                    livro.autor
                        .toLowerCase()
                        .includes(
                            pesquisa
                        );


                const correspondeGenero =

                    genero === ""

                    ||

                    livro.genero ===
                        genero;


                const correspondeStatus =

                    status === ""

                    ||

                    statusAtual ===
                        status;


                return (
                    correspondePesquisa
                    &&
                    correspondeGenero
                    &&
                    correspondeStatus
                );

            }
        );


    mostrarLivros(
        resultado
    );

}


/* ===================================
   EVENTOS
=================================== */

document
    .getElementById(
        "pesquisa-livro"
    )
    .addEventListener(
        "input",
        filtrarLivros
    );


document
    .getElementById(
        "filtro-genero"
    )
    .addEventListener(
        "change",
        filtrarLivros
    );


document
    .getElementById(
        "filtro-status"
    )
    .addEventListener(
        "change",
        filtrarLivros
    );


/* ===================================
   INICIAR
=================================== */

carregarLivros();