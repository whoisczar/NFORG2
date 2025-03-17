document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/notaFiscal");
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const notasFiscais = await response.json();
    if (!Array.isArray(notasFiscais)) {
      throw new Error("A resposta da API não é um array válido");
    }

    const tbody = document.querySelector("#ultimas-notas");
    tbody.innerHTML = ""; // Limpa as linhas da tabela

    notasFiscais.forEach((nota) => {
      const row = document.createElement("tr");
      row.innerHTML = ` 
        <td>${nota.idNotaFiscal}</td>
        <td>R$ ${parseFloat(nota.valorNotaFiscal).toFixed(2)}</td>
        <td>${new Date(nota.dataNotaFiscal).toLocaleDateString()}</td>
        <td>${nota.nomeClient}</td> <!-- Exibe o nome do cliente -->
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarNotaFiscal(${
            nota.idNotaFiscal
          })">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deletarNotaFiscal(${
            nota.idNotaFiscal
          })">Deletar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao buscar ou exibir as notas fiscais:", error);
    alert(
      "Ocorreu um erro ao carregar as notas fiscais. Verifique o console para mais detalhes."
    );
  }
});
