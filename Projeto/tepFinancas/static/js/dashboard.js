function valorInvalido(valor) {
    return isNaN(valor) || valor <= 0;
}

document.querySelector("#btnAdicionarReceita").addEventListener("click", function () {
    let valor = parseFloat(document.querySelector("#valorInput").value);
    
    // Verifica se o valor inserido é válido
    if (valorInvalido(valor)) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    // Obtém o valor atual de receitas
    let receitaAtual = parseFloat(document.querySelector("#receitas").textContent.replace("R$", "").trim());
    receitaAtual += valor;

    // Atualiza o valor de receitas
    document.querySelector("#receitas").textContent = "R$ " + receitaAtual.toFixed(2);

    // Limpa o campo de entrada após adicionar
    document.querySelector("#valorInput").value = '';
});

document.querySelector("#btnAdicionarDespesa").addEventListener("click", function () {
    let valor = parseFloat(document.querySelector("#valorInput").value);

    // Verifica se o valor inserido é válido
    if (valorInvalido(valor)) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    // Obtém o valor atual de despesas
    let despesaAtual = parseFloat(document.querySelector("#despesas").textContent.replace("R$", "").trim());
    despesaAtual += valor;

    // Atualiza o valor de despesas
    document.querySelector("#despesas").textContent = "R$ " + despesaAtual.toFixed(2);

    // Limpa o campo de entrada após adicionar
    document.querySelector("#valorInput").value = '';
});
