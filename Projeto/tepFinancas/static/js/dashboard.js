document.addEventListener("DOMContentLoaded", function () {
    carregarDadosDoBanco();
});


// Obtém o token CSRF
function getCSRFToken() {
    return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
}

// Função para enviar dados ao banco
function enviarDadosParaBanco(valor, tipo) {
    return fetch("tepFinancas/criar-item-ajax/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken(),
        },
        body: `valor=${encodeURIComponent(valor)}&tipo=${encodeURIComponent(tipo)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        return response.json(); // Retorna os dados do item criado
    });
}

// Função para carregar dados do banco ao inicializar
// Função para carregar dados do banco ao inicializar
function carregarDadosDoBanco() {
    fetch("/tepFinancas/obter-dados-ajax/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }
        return response.json();
    })
    .then(dados => {
        console.log("Dados carregados:", dados);  // Verifique se o 'id' está presente
        atualizarTabelaEDados(dados);
    })
    .catch(error => {
        console.error("Erro ao carregar dados do banco:", error);
    });
}

// Função para atualizar a tabela com os dados carregados
function atualizarTabelaEDados(dados) {
    const tabelaCorpo = document.querySelector("#transactionTable");
    tabelaCorpo.innerHTML = ""; // Limpa a tabela

    let totalReceitas = 0;
    let totalDespesas = 0;

    dados.forEach(item => {
        const novaLinha = document.createElement("tr");

        novaLinha.innerHTML = `
            <td>${item.data_hora}</td>
            <td>${item.tipo}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td>
                <!-- Certifique-se de que o ID está sendo passado corretamente para o onclick -->
                <button class="btn btn-danger btn-sm" onclick="excluirLinha(${item.id})">Excluir</button>
            </td>
        `;

        tabelaCorpo.appendChild(novaLinha);

        if (item.tipo === "Receita") {
            totalReceitas += parseFloat(item.valor);
        } else if (item.tipo === "Despesa") {
            totalDespesas += parseFloat(item.valor);
        }
    });

    document.querySelector("#receitas").textContent = formatarMoeda(totalReceitas);
    document.querySelector("#despesas").textContent = formatarMoeda(totalDespesas);
    document.querySelector("#saldoAtual").textContent = formatarMoeda(totalReceitas - totalDespesas);
}


// Função para registrar na tabela
function registrarNaTabela(tipo, valor) {
    // Envia os dados para o backend e aguarda a resposta
    enviarDadosParaBanco(valor, tipo)
        .then(dadoCriado => {
            console.log("Dado criado no backend:", dadoCriado);

            const tabelaCorpo = document.querySelector("#transactionTable");
            const novaLinha = document.createElement("tr");

            novaLinha.innerHTML = `
                <td>${new Date(dadoCriado.data).toLocaleString("pt-BR")}</td>
                <td>${dadoCriado.tipo}</td>
                <td>${formatarMoeda(dadoCriado.valor)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="excluirLinha(${dadoCriado.id})">Excluir</button>
                </td>
            `;

            tabelaCorpo.appendChild(novaLinha);

            // Atualiza os valores totais
            atualizarTotais();
        })
        .catch(error => {
            console.error("Erro ao registrar na tabela:", error);
            alert("Erro ao adicionar o item. Tente novamente.");
        });
}

// Função para excluir uma linha
function excluirLinha(itemId) {
    const csrfToken = getCSRFToken();
    
    console.log("Dados enviados para o backend:", { id: itemId }); // Verificar o que está sendo enviado

    if (!itemId) {
        console.error("ID inválido.");
        return;
    }

    fetch("/tepFinancas/excluir-item-ajax/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ id: itemId }), // Certifique-se de que está enviando o ID correto
    })
        .then(response => {
            console.log("Resposta do backend:", response); // Exibir detalhes da resposta
            if (!response.ok) {
                throw new Error(`Erro ao excluir: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Resposta JSON recebida:", data);
            if (data.mensagem) {
                const linha = document.querySelector(`button[onclick='excluirLinha(${itemId})']`).closest("tr");
                linha.remove();
                atualizarTotais();
            } else if (data.erro) {
                console.error(data.erro);
            }
        })
        .catch(error => {
            console.error("Erro ao excluir transação:", error);
        });
}


function atualizarTotais() {
    const linhas = document.querySelectorAll("#transactionTable tr");
    let totalReceitas = 0;
    let totalDespesas = 0;

    linhas.forEach(linha => {
        const tipo = linha.children[1].textContent;
        const valor = parseFloat(
            linha.children[2].textContent.replace("R$", "").replace(",", ".")
        );

        if (tipo === "Receita") {
            totalReceitas += valor;
        } else if (tipo === "Despesa") {
            totalDespesas += valor;
        }
    });

    document.querySelector("#receitas").textContent = formatarMoeda(totalReceitas);
    document.querySelector("#despesas").textContent = formatarMoeda(totalDespesas);
    document.querySelector("#saldoAtual").textContent = formatarMoeda(totalReceitas - totalDespesas);
}

// Formatação de moeda
function formatarMoeda(valor) {
    return `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
}

// Inicialização ao carregar a página
document.querySelector("#btnAdicionarReceita").addEventListener("click", function () {
    const valor = parseFloat(document.querySelector("#valorInput").value);
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }
    registrarNaTabela("Receita", valor);
    document.querySelector("#valorInput").value = "";
});

document.querySelector("#btnAdicionarDespesa").addEventListener("click", function () {
    const valor = parseFloat(document.querySelector("#valorInput").value);
    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }
    registrarNaTabela("Despesa", valor);
    document.querySelector("#valorInput").value = "";
});