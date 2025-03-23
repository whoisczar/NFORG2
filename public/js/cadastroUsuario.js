document
  .getElementById("cadastroForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const usuario = {
      cpfCnpjClient: document.getElementById("cpfCnpjClient").value,
      nomeClient: document.getElementById("nomeClient").value,
      emailClient: document.getElementById("emailClient").value,
      senhaClient: document.getElementById("senhaClient").value,
      cargoClient: document.getElementById("cargoClient").value,
      statusClient: 1,
      empresa: parseInt(document.getElementById("empresa").value),
    };

    try {
      const response = await fetch("http://localhost:3000/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById("mensagem").innerText =
          "Usuário cadastrado com sucesso!";
        document.getElementById("cadastroForm").reset();
        location.reload();

        // Atualiza a tabela após o cadastro
        await carregarUsuarios();
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
    // Busca os usuários cadastrados
    const response = await fetch("http://localhost:3000/client");
    const usuarios = await response.json();

    // Seleciona o corpo da tabela
    const tbody = document.querySelector("#tabelaUsuarios tbody");

    // Limpa o conteúdo atual da tabela
    tbody.innerHTML = "";

    // Preenche a tabela com os dados dos usuários
    usuarios.forEach((usuario) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${usuario.nomeClient}</td>
          <td>${usuario.cpfCnpjClient}</td>
          <td>${usuario.emailClient}</td>
          <td>${usuario.cargoClient}</td>
          <td>${usuario.statusClient === 1 ? "Ativo" : "Inativo"}</td>
        `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
});
