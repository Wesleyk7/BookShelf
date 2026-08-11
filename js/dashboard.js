async function carregarDashboard() {

    try {

        /* ===================================
           CARREGAR LIVROS
        =================================== */

        const respostaLivros =
            await fetch(
                "http://localhost:3000/api/livros"
            );


        const livros =
            await respostaLivros.json();


        /* ===================================
           CARREGAR EMPRÉSTIMOS
        =================================== */

        const respostaEmprestimos =
            await fetch(
                "http://localhost:3000/api/emprestimos"
            );


        const emprestimos =
            await respostaEmprestimos.json();


        /* ===================================
           ATUALIZAR STATUS
        =================================== */

        atualizarStatusAutomaticamente(
            emprestimos
        );


        /* ===================================
           CONTADORES
        =================================== */

        const totalLivros =
            livros.length;


        const totalEmprestados =
            emprestimos.filter(
                emprestimo =>
                    emprestimo.status === "Emprestado"
                    ||
                    emprestimo.status === "Atrasado"
            ).length;


        const totalPendentes =
            emprestimos.filter(
                emprestimo =>
                    emprestimo.status === "Atrasado"
            ).length;


        const totalDisponiveis =
            totalLivros - totalEmprestados;


        /* ===================================
           MOSTRAR CONTADORES
        =================================== */

        document.getElementById(
            "total-livros"
        ).textContent =
            totalLivros;


        document.getElementById(
            "total-emprestados"
        ).textContent =
            totalEmprestados;


        document.getElementById(
            "total-pendentes"
        ).textContent =
            totalPendentes;


        document.getElementById(
            "total-disponiveis"
        ).textContent =
            totalDisponiveis;


        /* ===================================
           EMPRÉSTIMOS RECENTES
        =================================== */

        mostrarEmprestimosRecentes(
            emprestimos
        );


        /* ===================================
           NOTIFICAÇÕES
        =================================== */

        mostrarNotificacoes(
            emprestimos
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

    }

}


/* ===================================
   STATUS AUTOMÁTICO
=================================== */

function atualizarStatusAutomaticamente(
    emprestimos
) {

    const hoje =
        new Date();


    hoje.setHours(
        0,
        0,
        0,
        0
    );


    emprestimos.forEach(
        emprestimo => {

            if (
                emprestimo.status ===
                "Devolvido"
            ) {

                return;

            }


            const dataPrevista =
                new Date(
                    emprestimo.data_prevista
                );


            if (
                hoje > dataPrevista
            ) {

                emprestimo.status =
                    "Atrasado";

            } else {

                emprestimo.status =
                    "Emprestado";

            }

        }
    );

}


/* ===================================
   EMPRÉSTIMOS RECENTES
=================================== */

function mostrarEmprestimosRecentes(
    emprestimos
) {

    const tabela =
        document.getElementById(
            "dashboard-emprestimos"
        );


    tabela.innerHTML = "";


    const recentes =
        [...emprestimos]
            .sort(
                (a, b) =>
                    b.id - a.id
            )
            .slice(
                0,
                5
            );


    if (
        recentes.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td colspan="4">
                    Nenhum empréstimo registrado.
                </td>

            </tr>

        `;

        return;

    }


    recentes.forEach(
        emprestimo => {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    ${emprestimo.livro_titulo}
                </td>

                <td>
                    ${emprestimo.responsavel}
                </td>

                <td>
                    ${formatarData(
                        emprestimo.data_prevista
                    )}
                </td>

                <td>

                    <span
                        class="status ${classeStatusEmprestimo(
                            emprestimo.status
                        )}"
                    >

                        ${emprestimo.status}

                    </span>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );

}


/* ===================================
   NOTIFICAÇÕES
=================================== */

function mostrarNotificacoes(
    emprestimos
) {

    const container =
        document.getElementById(
            "dashboard-notificacoes"
        );


    container.innerHTML = "";


    const atrasados =
        emprestimos.filter(
            emprestimo =>
                emprestimo.status ===
                    "Atrasado"
        );


    if (
        atrasados.length === 0
    ) {

        container.innerHTML = `

            <div class="notificacao">

                <span>
                    ✅
                </span>

                <div>

                    <strong>
                        Nenhuma pendência
                    </strong>

                    <p>
                        Não existem devoluções atrasadas.
                    </p>

                </div>

            </div>

        `;

        return;

    }


    atrasados.forEach(
        emprestimo => {

            const notificacao =
                document.createElement(
                    "div"
                );


            notificacao.classList.add(
                "notificacao"
            );


            notificacao.innerHTML = `

                <span>
                    ⚠️
                </span>

                <div>

                    <strong>
                        Devolução atrasada
                    </strong>

                    <p>
                        ${emprestimo.livro_titulo}
                        deveria ter sido devolvido em
                        ${formatarData(
                            emprestimo.data_prevista
                        )}.
                    </p>

                </div>

            `;


            container.appendChild(
                notificacao
            );

        }
    );

}


/* ===================================
   FORMATAR DATA
=================================== */

function formatarData(
    data
) {

    if (!data) {

        return "-";

    }


    const dataObjeto =
        new Date(data);


    return dataObjeto
        .toLocaleDateString(
            "pt-BR",
            {
                timeZone: "UTC"
            }
        );

}


/* ===================================
   CLASSE DO STATUS
=================================== */

function classeStatusEmprestimo(
    status
) {

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
        status === "Devolvido"
    ) {

        return "disponivel";

    }


    return "";

}


/* ===================================
   INICIAR
=================================== */

carregarDashboard();