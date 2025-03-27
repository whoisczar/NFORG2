document.addEventListener("DOMContentLoaded", async function () {
  const tabelaNotas = document.querySelector("#tabelaNotas tbody");
  const ctxNotas = document.getElementById("graficoNotas")?.getContext("2d");
  const ctxProdutos = document
    .getElementById("graficoProdutosMaisVendidos")
    ?.getContext("2d");

  // Verifica se os elementos foram encontrados
  if (!tabelaNotas || !ctxNotas || !ctxProdutos) {
    console.error("Elementos não encontrados!");
    return;
  }

  // Função para carregar notas fiscais
  async function carregarNotasFiscais() {
    try {
      const response = await fetch("http://localhost:3000/notaFiscal");
      if (!response.ok) {
        throw new Error("Erro ao buscar notas fiscais");
      }

      const notas = await response.json();
      console.log("Notas fiscais recebidas");

      // Ordena as notas pela data de emissão em ordem decrescente
      const notasOrdenadas = notas.sort((a, b) => {
        return new Date(b.dataNotaFiscal) - new Date(a.dataNotaFiscal);
      });

      // Seleciona as 10 notas mais recentes
      const ultimas10Notas = notasOrdenadas.slice(0, 10);

      // Limpa a tabela antes de preencher
      tabelaNotas.innerHTML = "";

      // Preenche a tabela com os dados filtrados
      ultimas10Notas.forEach((nota) => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", nota.idNotaFiscal); // Adiciona o ID da nota como atributo
        row.innerHTML = `
          <td>${nota.idNotaFiscal}</td>
          <td>${nota.nomeClient}</td>
          <td>R$ ${nota.valorNotaFiscal}</td>
          <td>${new Date(nota.dataNotaFiscal).toLocaleDateString()}</td>
          <td>${new Date(nota.dataNotaCadastrada).toLocaleDateString()}</td>
        `;
        tabelaNotas.appendChild(row);
      });

      // Adiciona o evento de clique às linhas da tabela
      tabelaNotas.querySelectorAll("tr[data-id]").forEach((row) => {
        row.addEventListener("click", () => {
          const idNotaFiscal = row.getAttribute("data-id"); // Obtém o ID da nota
          detalharNota(idNotaFiscal); // Chama a função de redirecionamento
        });
      });

      // Processa os dados para o gráfico de notas por dia
      const notasPorDia = {};
      notas.forEach((nota) => {
        const data = new Date(nota.dataNotaFiscal).toLocaleDateString();
        if (notasPorDia[data]) {
          notasPorDia[data]++;
        } else {
          notasPorDia[data] = 1;
        }
      });

      const labelsNotas = Object.keys(notasPorDia); // Dias
      const dataNotas = Object.values(notasPorDia); // Quantidade de notas por dia

      // Cria o gráfico de notas por dia
      new Chart(ctxNotas, {
        data: {
          labels: labelsNotas,
          datasets: [
            {
              type: "line",
              label: "Notas por Dia",
              data: dataNotas,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
            },
            {
              type: "bar",
              label: "Notas por Dia",
              data: dataNotas,
              backgroundColor: "white",
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao carregar notas fiscais:", error);
    }
  }

  async function carregarProdutosMaisVendidos() {
    try {
      // Defina as datas inicial e final (exemplo: último mês)
      const dataInicial = "1999-01-01"; // Substitua pela data inicial desejada
      const dataFinal = "9999-01-01"; // Substitua pela data final desejada

      const response = await fetch(
        `http://localhost:3000/produto/mais-vendidos?dataInicial=${dataInicial}&dataFinal=${dataFinal}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos mais vendidos");
      }

      const produtos = await response.json();
      console.log("Produtos mais vendidos recebidos");

      // Prepara os dados para o gráfico
      const labelsProdutos = produtos.map((produto) => produto.nomeProduto);
      const dataProdutos = produtos.map((produto) => produto.total_vendido);

      // Cria o gráfico de produtos mais vendidos
      new Chart(ctxProdutos, {
        type: "bar",
        data: {
          labels: labelsProdutos,
          datasets: [
            {
              label: "Quantidade Vendida",
              data: dataProdutos,
              backgroundColor: "#C7815C",
              borderColor: "black",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao carregar produtos mais vendidos:", error);
    }
  }

  // Carrega as notas fiscais e os produtos mais vendidos
  await carregarNotasFiscais();
  await carregarProdutosMaisVendidos();
});

// Função para redirecionar para a página de detalhes da nota
window.detalharNota = function (idNotaFiscal) {
  window.location.href = `ajustesNota.html?id=${idNotaFiscal}`;
};
