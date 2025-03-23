document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID da nota fiscal da URL
  const urlParams = new URLSearchParams(window.location.search);
  const idNotaFiscal = urlParams.get("id");

  if (!idNotaFiscal) {
    alert("ID da nota fiscal não encontrado na URL.");
    return;
  }

  // Função para carregar os detalhes da nota fiscal
  async function carregarDetalhesNota(idNotaFiscal) {
    try {
      // Faz a requisição para o endpoint de detalhes da nota fiscal
      const response = await fetch(
        `http://localhost:3000/notaFiscal/${idNotaFiscal}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar detalhes da nota fiscal");
      }
      const notaFiscal = await response.json();
      exibirDetalhesNota(notaFiscal);
    } catch (error) {
      console.error("Erro:", error);
      alert(
        "Erro ao carregar detalhes da nota fiscal. Verifique o console para mais detalhes."
      );
    }
  }

  // Função para exibir os detalhes da nota fiscal
  function exibirDetalhesNota(notaFiscal) {
    // Exibe as informações da nota fiscal
    document.getElementById("idNotaFiscal").textContent =
      notaFiscal.idNotaFiscal;
    document.getElementById("nomeEmpresa").textContent = notaFiscal.nomeEmpresa;
    document.getElementById("dataNotaFiscal").textContent = new Date(
      notaFiscal.dataNotaFiscal
    ).toLocaleDateString();
    document.getElementById(
      "valorNotaFiscal"
    ).textContent = `R$ ${notaFiscal.valorNotaFiscal}`;

    // Exibe os produtos da nota fiscal (se existirem)
    const tabelaProdutos = document
      .getElementById("tabelaProdutos")
      .getElementsByTagName("tbody")[0];
    tabelaProdutos.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados

    if (notaFiscal.produtos && notaFiscal.produtos.length > 0) {
      notaFiscal.produtos.forEach((produto) => {
        const row = tabelaProdutos.insertRow();
        row.insertCell().textContent = produto.nomeProduto; // Nome do produto
        row.insertCell().textContent = produto.quantidade; // Quantidade
        row.insertCell().textContent = `R$ ${produto.valorProduto}`; // Valor unitário
        row.insertCell().textContent = `R$ ${
          produto.valorProduto * produto.quantidade
        }`; // Valor total
      });
    } else {
      const row = tabelaProdutos.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 4; // Mescla as colunas
      cell.textContent = "Nenhum produto encontrado para esta nota fiscal.";
      cell.style.textAlign = "center";
    }
  }

  // Carrega os detalhes da nota fiscal ao iniciar a página
  carregarDetalhesNota(idNotaFiscal);
});
