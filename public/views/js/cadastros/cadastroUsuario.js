document.addEventListener("DOMContentLoaded", async () => {
  // Carrega empresas e popula o select
  const empresaSelect = document.getElementById("empresa");

  try {
    const resEmpresas = await fetch("http://localhost:3000/empresa");
    const empresas = await resEmpresas.json();

    empresas
      .sort((a, b) => a.nomeEmpresa.localeCompare(b.nomeEmpresa)) // ordena por nome
      .forEach((empresa) => {
        const option = document.createElement("option");
        option.value = empresa.idEmpresa;
        option.textContent = `${empresa.nomeEmpresa} (${empresa.cnpjEmpresa})`;
        empresaSelect.appendChild(option);
      });
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
  }

  // Carrega usuários
  try {
    const response = await fetch("http://localhost:3000/client");
    const usuarios = await response.json();

    const tbody = document.querySelector("#tabelaUsuarios tbody");
    tbody.innerHTML = "";

    usuarios.forEach((usuario) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", usuario.cpfCnpjClient); // Usa CPF/CNPJ como identificador

      row.innerHTML = `
        <td>${usuario.nomeClient}</td>
        <td>${usuario.cpfCnpjClient}</td>
        <td>${usuario.emailClient}</td>
        <td>${usuario.cargoClient}</td>
        <td>${usuario.statusClient === 1 ? "Ativo" : "Inativo"}</td>
        <td><i class="fa-solid fa-bars"></i></td>
      `;

      tbody.appendChild(row);
    });

    document.querySelectorAll("#tabelaUsuarios tbody tr").forEach((row) => {
      row.addEventListener("click", () => {
        const cpfCnpjUsuario = row.getAttribute("data-id");
        if (cpfCnpjUsuario) {
          window.location.href = `ajustesUsuario.html?cpfCnpj=${cpfCnpjUsuario}`;
        } else {
          console.error("CPF/CNPJ do usuário não encontrado!");
        }
      });
    });
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
});

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

        await carregarUsuarios(); // Se essa função existir
      } else {
        document.getElementById("mensagem").innerText = "Erro: " + data.message;
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      document.getElementById("mensagem").innerText =
        "Erro ao conectar com o servidor.";
    }
  });
