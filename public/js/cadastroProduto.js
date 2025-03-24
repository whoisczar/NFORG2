document
  .getElementById("cadastroForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const Produto = {
      nomeProduto: document.getElementById("nomeProduto").value,
      eanProduto: document.getElementById("eanProduto").value,
      valorProduto: document.getElementById("valorProduto").value,
    };

    try {
      const response = await fetch("http://localhost:3000/produto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Produto),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("mensagem").innerText =
          "Produto cadastrado com sucesso!";
        document.getElementById("cadastroForm").reset();
        alert("Produtos cadastrados com sucesso!" + `${Produto}`);
      } else {
        document.getElementById("mensagem").innerText = "Erro: " + data.message;
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      document.getElementById("mensagem").innerText =
        "Erro ao conectar com o servidor.";
    }
  });

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://localhost:3000/produto");
    const produto = await response.json();

    const tbody = document.querySelector("#tabelaProdutos tbody");
    tbody.innerHTML = "";

    produto.forEach((produto) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", produto.eanProduto); // Usa CPF/CNPJ como identificador

      row.innerHTML = `
          <td>${produto.nomeProduto}</td>
          <td>${produto.eanProduto}</td>
          <td>${produto.valorProduto}</td>
        `;

      tbody.appendChild(row);
    });

    document.querySelectorAll("#tabelaProdutos tbody tr").forEach((row) => {
      row.addEventListener("click", () => {
        const eanProduto = row.getAttribute("data-id"); // Obtém o CPF/CNPJ do usuário
        if (eanProduto) {
          window.location.href = `ajustesProduto.html?ean=${eanProduto}`;
        } else {
          console.error("Ean do Produto não encontrado!");
        }
      });
    });
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
});
