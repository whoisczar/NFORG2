document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  if (!id) {
    document.body.innerHTML = "<h2>ID do produto não encontrado!</h2>";
    return;
  }

  try {
    // Carrega as informações do produto
    const response = await fetch(`http://localhost:3000/produto/${id}`);
    if (!response.ok) {
      throw new Error("Produto não encontrado");
    }

    const produto = await response.json();
    console.log(`${JSON.stringify(produto)} carregado`);
    // Preenche os campos com os dados atuais
    document.getElementById("nomeProduto").textContent = produto.nomeProduto;
    document.getElementById("eanProduto").textContent = produto.eanProduto;
    document.getElementById(
      "valorProduto"
    ).textContent = `RS ${produto.valorProduto}`;

    // Preenche os campos com os dados atuais
    document.getElementById("nome").value = produto.nomeProduto;
    document.getElementById("ean").value = produto.eanProduto;
    document.getElementById("valor").value = produto.valorProduto;
  } catch (error) {
    console.error("Erro ao carregar detalhes do produto:", error);
    document.body.innerHTML = "<h2>Erro ao carregar produto</h2>";
  }

  // Função de atualização de dados do produto
  const form = document.getElementById("formEdicaoProduto");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById("nomeProduto").value;
    const ean = document.getElementById("eanProduto").value;
    const valor = parseFloat(
      document.getElementById("valorProduto").value.replace(",", ".")
    );

    const produtoData = {
      nomeProduto: nome,
      eanProduto: ean,
      valorProduto: valor,
    };

    try {
      const response = await fetch(`http://localhost:3000/produto/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar produto");
      }

      const result = await response.json();
      alert(result.message); // Exibe a mensagem de sucesso ou erro
      window.location.href = "../cadastroProduto.html"; // Redireciona para a página de listagem
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar o produto.");
    }
  });
});
