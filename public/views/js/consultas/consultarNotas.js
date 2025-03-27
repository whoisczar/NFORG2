document.addEventListener("DOMContentLoaded", function () {
  const filtroEmpresa = document.getElementById("filtroEmpresa");
  const btnFiltrar = document.getElementById("btnFiltrar");
  const tabelaNotas = document
    .getElementById("tabelaNotas")
    .getElementsByTagName("tbody")[0];

  // Função para carregar notas fiscais
  async function carregarNotasFiscais(filtro) {
    try {
      // Se o filtro estiver vazio, não faz nada
      if (!filtro) {
        alert("Por favor, insira o nome da empresa para filtrar.");
        return;
      }

      // Faz a requisição para o endpoint de busca de notas fiscais
      const response = await fetch(
        `http://localhost:3000/notaFiscal/search?empresa=${encodeURIComponent(
          filtro
        )}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar notas fiscais");
      }
      const notas = await response.json();
      exibirNotasFiscais(notas);
    } catch (error) {
      console.error("Erro:", error);
      alert(
        "Erro ao carregar notas fiscais. Verifique o console para mais detalhes."
      );
    }
  }

  // Função para exibir notas fiscais na tabela
  function exibirNotasFiscais(notas) {
    tabelaNotas.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados

    // Verifica se há notas fiscais para exibir
    if (notas.length === 0) {
      const row = tabelaNotas.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 5; // Mescla as colunas
      cell.textContent = "Nenhuma nota fiscal encontrada.";
      cell.style.textAlign = "center";
      return;
    }

    // Preenche a tabela com as notas fiscais
    notas.forEach((nota) => {
      const row = tabelaNotas.insertRow();
      row.insertCell().textContent = nota.idNotaFiscal;
      row.insertCell().textContent = nota.nomeEmpresa;
      row.insertCell().textContent = new Date(
        nota.dataNotaFiscal
      ).toLocaleDateString();

      // Verifica se o valor é um número antes de usar toFixed
      const valorNotaFiscal = parseFloat(nota.valorNotaFiscal);
      if (isNaN(valorNotaFiscal)) {
        row.insertCell().textContent = "Valor inválido";
      } else {
        row.insertCell().textContent = `R$ ${valorNotaFiscal.toFixed(2)}`;
      }

      row.insertCell().innerHTML = `<button onclick="detalharNota(${nota.idNotaFiscal})">Detalhes</button>`;
    });
  }

  // Evento de filtro
  btnFiltrar.addEventListener("click", function () {
    const filtro = filtroEmpresa.value.trim();
    carregarNotasFiscais(filtro);
  });
});

// Função para exibir detalhes da nota fiscal
window.detalharNota = function (idNotaFiscal) {
  window.location.href = `ajustesNota.html?id=${idNotaFiscal}`;
};
