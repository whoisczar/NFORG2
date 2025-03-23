document.addEventListener("DOMContentLoaded", async function () {
  const tabelaNotas = document.querySelector("#tabelaNotas tbody");
  const ctx = document.getElementById("graficoNotas")?.getContext("2d"); // Contexto do gráfico

  // Verifica se o tbody foi encontrado
  if (!tabelaNotas) {
    console.error("Elemento tbody não encontrado!");
    return;
  }

  async function carregarNotasFiscais() {
    try {
      const response = await fetch("http://localhost:3000/notaFiscal");
      if (!response.ok) {
        throw new Error("Erro ao buscar notas fiscais");
      }

      const notas = await response.json();
      console.log("Notas fiscais recebidas:", notas); // Verifique os dados recebidos

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
        row.innerHTML = `
                <td>${nota.idNotaFiscal}</td>
                <td>${nota.nomeClient}</td>
                <td>R$ ${nota.valorNotaFiscal}</td>
                <td>${new Date(nota.dataNotaFiscal).toLocaleDateString()}</td>
                <td>${new Date(
                  nota.dataNotaCadastrada
                ).toLocaleDateString()}</td>
              `;
        tabelaNotas.appendChild(row);
      });

      // Processa os dados para o gráfico
      const notasPorDia = {};
      notas.forEach((nota) => {
        const data = new Date(nota.dataNotaFiscal).toLocaleDateString(); // Usando dataNotaFiscal
        if (notasPorDia[data]) {
          notasPorDia[data]++;
        } else {
          notasPorDia[data] = 1;
        }
      });

      const labels = Object.keys(notasPorDia); // Dias
      const data = Object.values(notasPorDia); // Quantidade de notas por dia

      // Verifica se o contexto do gráfico foi encontrado
      if (!ctx) {
        console.error("Elemento canvas não encontrado!");
        return;
      }

      // Cria o gráfico
      new Chart(ctx, {
        type: "bar", // Tipo de gráfico (pode ser "line" para gráfico de linha)
        data: {
          labels: labels,
          datasets: [
            {
              label: "Notas por Dia",
              data: data,
              backgroundColor: "#52357b",
              borderColor: "white",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true, // Torna o gráfico responsivo
          maintainAspectRatio: false, // Permite ajustar a proporção
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true, // Exibe a legenda
              position: "top", // Posição da legenda
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao carregar notas fiscais:", error);
    }
  }

  await carregarNotasFiscais();
});
