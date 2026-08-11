async function carregarEmprestimos() {

    try {

        const resposta =
            await fetch(
                "http://localhost:3000/api/emprestimos"
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar empréstimos."
            );

        }


        const emprestimos =
            await resposta.json();


        atualizarStatusAutomaticamente(
            emprestimos
        );


        mostrarEmprestimos(
            emprestimos
        );


        atualizarResumo(
            emprestimos
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar empréstimos:",
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
   RESUMO
=================================== */

function atualizarResumo(
    emprestimos
) {

    const ativos =
        emprestimos.filter(
            item =>
                item.status ===
                "Emprestado"
        ).length;


    const atrasados =
        emprestimos.filter(
            item =>
                item.status ===
                "Atrasado"
        ).length;


    const devolvidos =
        emprestimos.filter(
            item =>
                item.status ===
                "Devolvido"
        ).length;


    document.getElementById(
        "emprestimos-ativos"
    ).textContent =
        ativos;


    document.getElementById(
        "emprestimos-atrasados"
    ).textContent =
        atrasados;


    document.getElementById(
        "emprestimos-devolvidos"
    ).textContent =
        devolvidos;

}


/* ===================================
   MOSTRAR EMPRÉSTIMOS
=================================== */

function mostrarEmprestimos(
    emprestimos
) {

    const tabela =
        document.getElementById(
            "lista-emprestimos"
        );


    tabela.innerHTML = "";


    emprestimos.forEach(
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
                        emprestimo.data_retirada
                    )}
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

                <td>

                    ${
                        emprestimo.status !==
                            "Devolvido"

                        ?

                        `
                        <button
                            class="botao-devolucao"
                            onclick="registrarDevolucao(${emprestimo.id})"
                        >
                            Devolver
                        </button>
                        `

                        :

                        `
                        <span class="texto-devolvido">
                            Finalizado
                        </span>
                        `
                    }

                </td>

            `;


            tabela.appendChild(
                linha
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
   COR DO STATUS
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
   DEVOLUÇÃO
=================================== */

async function registrarDevolucao(
    idEmprestimo
) {

    const confirmar =
        confirm(
            "Deseja registrar a devolução deste livro?"
        );


    if (!confirmar) {

        return;

    }


    try {

        const resposta =
            await fetch(
                `http://localhost:3000/api/emprestimos/${idEmprestimo}/devolver`,
                {
                    method: "PUT"
                }
            );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            alert(
                resultado.mensagem
                ||
                "Erro ao registrar devolução."
            );

            return;

        }


        alert(
            resultado.mensagem
        );


        carregarEmprestimos();


    } catch (erro) {

        console.error(
            "Erro ao registrar devolução:",
            erro
        );


        alert(
            "Não foi possível conectar ao servidor."
        );

    }

}


/* ===================================
   INICIAR
=================================== */

carregarEmprestimos();