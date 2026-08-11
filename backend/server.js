const express = require("express");
const cors = require("cors");
const banco = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;


/* ================================
   CONFIGURAÇÕES
================================ */

app.use(cors());

app.use(express.json());


/* ================================
   ROTA DE TESTE
================================ */

app.get("/", (req, res) => {

    res.json({
        mensagem: "API BookShelf funcionando!"
    });

});


/* ================================
   TESTAR MYSQL
================================ */

app.get("/api/teste-banco", async (req, res) => {

    try {

        const [resultado] =
            await banco.query(
                "SELECT 1 AS conectado"
            );


        res.json({
            sucesso: true,
            mensagem:
                "Conexão com MySQL realizada com sucesso!",
            resultado: resultado
        });


    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false,
            mensagem:
                "Erro ao conectar com MySQL."
        });

    }

});


/* ================================
   LISTAR LIVROS
================================ */

app.get("/api/livros", async (req, res) => {

    try {

        const [livros] =
            await banco.query(
                "SELECT * FROM livros"
            );


        res.json(livros);


    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                "Erro ao buscar livros."
        });

    }

});

/* ================================
   LISTAR EMPRÉSTIMOS
================================ */

app.get("/api/emprestimos", async (req, res) => {

    try {

        const [emprestimos] = await banco.query(`
            SELECT
                emprestimos.*,
                livros.titulo AS livro_titulo,
                livros.autor AS livro_autor
            FROM emprestimos
            INNER JOIN livros
                ON emprestimos.livro_id = livros.id
            ORDER BY emprestimos.id DESC
        `);

        res.json(emprestimos);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar empréstimos."
        });

    }

});


/* ================================
   CADASTRAR EMPRÉSTIMO
================================ */

app.post("/api/emprestimos", async (req, res) => {

    try {

        const {
            livroId,
            responsavel,
            dataRetirada,
            dataPrevista,
            observacoes
        } = req.body;


        // Verifica se o livro já está emprestado
        const [emprestimosAtivos] = await banco.query(
            `
            SELECT id
            FROM emprestimos
            WHERE livro_id = ?
            AND status IN ('Emprestado', 'Atrasado')
            `,
            [livroId]
        );


        if (emprestimosAtivos.length > 0) {

            return res.status(400).json({
                mensagem:
                    "Este livro já possui um empréstimo ativo."
            });

        }


        // Cadastra o empréstimo
        const [resultado] = await banco.query(
            `
            INSERT INTO emprestimos (
                livro_id,
                responsavel,
                data_retirada,
                data_prevista,
                observacoes,
                status
            )
            VALUES (?, ?, ?, ?, ?, 'Emprestado')
            `,
            [
                livroId,
                responsavel,
                dataRetirada,
                dataPrevista,
                observacoes
            ]
        );


        res.status(201).json({

            mensagem:
                "Empréstimo registrado com sucesso!",

            id:
                resultado.insertId

        });


    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            mensagem:
                "Erro ao registrar empréstimo."
        });

    }

});

/* ================================
   REGISTRAR DEVOLUÇÃO
================================ */

app.put(
    "/api/emprestimos/:id/devolver",
    async (req, res) => {

        try {

            const id =
                req.params.id;


            const [resultado] =
                await banco.query(
                    `
                    UPDATE emprestimos
                    SET
                        status = 'Devolvido',
                        data_devolucao = CURDATE()
                    WHERE id = ?
                    `,
                    [id]
                );


            if (
                resultado.affectedRows === 0
            ) {

                return res
                    .status(404)
                    .json({
                        mensagem:
                            "Empréstimo não encontrado."
                    });

            }


            res.json({
                mensagem:
                    "Devolução registrada com sucesso!"
            });


        } catch (erro) {

            console.error(erro);


            res
                .status(500)
                .json({
                    mensagem:
                        "Erro ao registrar devolução."
                });

        }

    }
);

/* ================================
   INICIAR SERVIDOR
================================ */

app.listen(PORT, () => {

    console.log(
        `BookShelf rodando na porta ${PORT}`
    );

});