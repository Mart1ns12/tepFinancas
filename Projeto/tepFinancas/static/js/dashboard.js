// obtem token de acesso
function getCSRFToken() {
    return document.querySelector('input[name="csrfmiddlewaretoken"]').value;
}

// funcao que envia dados ao banco
function enviarDadosParaBanco(valor, tipo) {
    fetch("tepFinancas/criar-item-ajax/", {
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
        return response.json();
    })
    .then(data => {
        console.log("Dados recebidos:", data);
    })
    .catch(error => {
        console.error("Erro ao processar a requisição:", error);
    });
}



// Função para validar o valor inserido
function valorInvalido(valor) {
    return isNaN(valor) || valor <= 0;
}

// Função para formatar o valor como moeda
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// Função para registrar na tabela
function registrarNaTabela(operacao, tipo, valor) {
    const tabelaCorpo = document.querySelector("#transactionTable");
    const novaLinha = document.createElement("tr");

    const dataHora = new Date().toLocaleString("pt-BR");

    novaLinha.innerHTML = `
        <td>${dataHora}</td>
        <td>${operacao}</td>
        <td>${tipo}</td>
        <td>${formatarMoeda(valor)}</td>
    `;

    tabelaCorpo.appendChild(novaLinha);
}

// Atualiza valores
function atualizarValor(id, valor, operacao) {
    const elemento = document.querySelector(id);
    let valorAtual = parseFloat(
        elemento.textContent.replace("R$", "").trim().replace(",", ".")
    ) || 0;

    if (operacao === "adicionar") {
        valorAtual += valor;
    } else if (operacao === "deduzir") {
        if (valor > valorAtual) {
            alert(`Não é possível deduzir mais do que o valor atual de ${id}.`);
            return false;
        }
        valorAtual -= valor;
    }

    elemento.textContent = formatarMoeda(valorAtual);
    return true;
}


// Evento para Adicionar Receita
document.querySelector("#btnAdicionarReceita").addEventListener("click", function () {
    const valor = parseFloat(document.querySelector("#valorInput").value);
    if (valorInvalido(valor)) {
        alert("Por favor, insira um valor válido.");
        return;
    }
    if (atualizarValor("#receitas", valor, "adicionar")) {
        registrarNaTabela("Adicionar", "Receita", valor);
    }
    document.querySelector("#valorInput").value = "";
    enviarDadosParaBanco(valor, "Receita");
});


// Evento para Adicionar Despesa
document.querySelector("#btnAdicionarDespesa").addEventListener("click", function () {
    const valor = parseFloat(document.querySelector("#valorInput").value);
    if (valorInvalido(valor)) {
        alert("Por favor, insira um valor válido.");
        return;
    }
    if (atualizarValor("#despesas", valor, "adicionar")) {
        registrarNaTabela("Adicionar", "Despesa", valor);
    }
    document.querySelector("#valorInput").value = "";
    enviarDadosParaBanco(valor, "Despesa");
});



