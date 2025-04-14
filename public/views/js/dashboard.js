document.addEventListener("DOMContentLoaded", async function () {
  const tabelaNotas = document.querySelector("#tabelaNotas tbody");
  const ctxNotas = document.getElementById("graficoNotas")?.getContext("2d");
  const ctxProdutos = document
    .getElementById("graficoProdutosMaisVendidos")
    ?.getContext("2d");

  // Utilitário: cria uma linha da tabela
  function criarLinhaNota(nota) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", nota.idNotaFiscal);
    row.innerHTML = `
      <td>${nota.idNotaFiscal}</td>
      <td>${nota.nomeClient}</td>
      <td>R$ ${nota.valorNotaFiscal}</td>
      <td>${new Date(nota.dataNotaFiscal).toLocaleDateString()}</td>
      <td>${new Date(nota.dataNotaCadastrada).toLocaleDateString()}</td>
      <td><i class="fa-solid fa-bars"></i></td>
    `;
    row.addEventListener("click", () => detalharNota(nota.idNotaFiscal));
    return row;
  }

  // Utilitário: gera gráfico (bar ou line)
  function gerarGrafico(ctx, tipo, labels, dados, titulo) {
    if (!ctx) return;

    new Chart(ctx, {
      type: tipo,
      data: {
        labels: labels,
        datasets: [
          {
            label: titulo,
            data: dados,
            backgroundColor: tipo === "bar" ? "#C7815C" : "white",
            borderColor: "black",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      },
    });
  }

  // Carrega as últimas 10 notas fiscais e cria gráfico por dia
  async function carregarNotasFiscais() {
    const response = await fetch("http://localhost:3000/notaFiscal");
    if (!response.ok) throw new Error("Erro ao buscar notas fiscais");

    const notas = await response.json();
    const notasOrdenadas = notas.sort(
      (a, b) => new Date(b.dataNotaFiscal) - new Date(a.dataNotaFiscal)
    );
    const ultimas10Notas = notasOrdenadas.slice(0, 10);

    tabelaNotas.innerHTML = "";
    ultimas10Notas.forEach((nota) =>
      tabelaNotas.appendChild(criarLinhaNota(nota))
    );

    const notasPorDia = {};
    notas.forEach((nota) => {
      const data = new Date(nota.dataNotaFiscal).toLocaleDateString();
      notasPorDia[data] = (notasPorDia[data] || 0) + 1;
    });

    const labels = Object.keys(notasPorDia);
    const data = Object.values(notasPorDia);

    gerarGrafico(ctxNotas, "line", labels, data, "Notas por Dia");
  }

  // Carrega produtos mais vendidos e exibe em gráfico
  async function carregarProdutosMaisVendidos() {
    const dataInicial = "1999-01-01";
    const dataFinal = "9999-01-01";

    const response = await fetch(
      `http://localhost:3000/produto/mais-vendidos?dataInicial=${dataInicial}&dataFinal=${dataFinal}`
    );
    if (!response.ok) throw new Error("Erro ao buscar produtos mais vendidos");

    const produtos = await response.json();
    const labels = produtos.map((p) => p.nomeProduto);
    const data = produtos.map((p) => p.total_vendido);

    gerarGrafico(ctxProdutos, "bar", labels, data, "Produtos Mais Vendidos");
  }

  // Executa tudo em paralelo e trata erros gerais
  try {
    await Promise.all([carregarNotasFiscais(), carregarProdutosMaisVendidos()]);
  } catch (error) {
    console.error("Erro geral no carregamento dos dados:", error);
    alert("Erro ao carregar dados. Verifique o console para mais informações.");
  }
});

// Redireciona para a tela de detalhes da nota fiscal
window.detalharNota = function (idNotaFiscal) {
  window.location.href = `detalhesNota.html?id=${idNotaFiscal}`;
};
