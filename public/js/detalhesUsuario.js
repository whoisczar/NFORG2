document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cpfCnpjClient = urlParams.get("cpfCnpj");

  if (!cpfCnpjClient) {
    document.body.innerHTML = "<h2>CPF/CNPJ não encontrado!</h2>";
    return;
  }

  try {
    // Carrega as informações do usuário
    const response = await fetch(
      `http://localhost:3000/client/${cpfCnpjClient}`
    );
    if (!response.ok) {
      throw new Error("Usuário não encontrado");
    }

    const usuario = await response.json();

    // Preenche os campos com os dados atuais
    document.getElementById("nomeClient").textContent = usuario.nomeClient;
    document.getElementById("cpfCnpjClient").textContent =
      usuario.cpfCnpjClient;
    document.getElementById("emailClient").textContent = usuario.emailClient;
    document.getElementById("cargoClient").textContent = usuario.cargoClient;
    document.getElementById("statusClient").textContent =
      usuario.statusClient === 1 ? "Ativo" : "Inativo";

    // Preenche os campos do formulário de edição
    document.getElementById("nome").value = usuario.nomeClient;
    document.getElementById("email").value = usuario.emailClient;
    document.getElementById("cargo").value = usuario.cargoClient;
    document.getElementById("senha").value = ""; // Campo de senha limpo inicialmente

    // Carregar empresas e selecionar a empresa associada ao cliente
    await carregarEmpresas();

    // Selecionar a empresa do cliente no select
    document.getElementById("empresa").value = usuario.empresa; // A empresa associada ao cliente (usando o id da empresa)
  } catch (error) {
    console.error("Erro ao carregar detalhes do usuário:", error);
    document.body.innerHTML = "<h2>Erro ao carregar usuário</h2>";
  }

  // Função para carregar empresas
  async function carregarEmpresas() {
    try {
      const response = await fetch("http://localhost:3000/empresa");
      if (!response.ok) {
        throw new Error("Erro ao buscar empresas");
      }
      const empresas = await response.json();

      // Preenche o campo select com as empresas
      const selectEmpresa = document.getElementById("empresa");
      selectEmpresa.innerHTML = empresas
        .map(
          (empresa) => `
            <option value="${empresa.idEmpresa}">${empresa.nomeEmpresa}</option>
          `
        )
        .join("");
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    }
  }

  // Função de atualização de dados do usuário
  const form = document.getElementById("formEdicao");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const cargo = document.getElementById("cargo").value;
    const senha = document.getElementById("senha").value;
    const idEmpresa = document.getElementById("empresa").value; // Seleção da empresa (id da empresa)

    const clientData = {
      nomeClient: nome,
      emailClient: email,
      cargoClient: cargo,
      senhaClient: senha ? senha : null, // Envia null quando senha não for preenchida
      statusClient: 1,
      empresa: idEmpresa, // Envia o id da empresa
    };

    try {
      const response = await fetch(
        `http://localhost:3000/client/${cpfCnpjClient}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar cliente");
      }

      const result = await response.json();
      alert(result.message); // Exibe a mensagem de sucesso ou erro
      window.location.href = "../cadastroUsuario.html";
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("Erro ao atualizar o cliente.");
    }
  });
});
