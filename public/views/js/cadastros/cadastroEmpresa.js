document.addEventListener("DOMContentLoaded", async () => {
  await carregarEmpresas(); // Carrega a tabela ao iniciar a página

  document
    .getElementById("cadastroForm")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      await cadastrarEmpresa();
    });
});

/**
 * Cadastra uma nova empresa no sistema e também cria um usuário associado.
 */
async function cadastrarEmpresa() {
  const nomeInput = document.getElementById("nomeEmpresa");
  const cpfCnpjInput = document.getElementById("cpfCnpjClient");

  if (!nomeInput || !cpfCnpjInput) {
    console.error("Campos obrigatórios não encontrados.");
    return;
  }

  const empresa = {
    nomeEmpresa: nomeInput.value,
    cnpjEmpresa: cpfCnpjInput.value,
    statusEmpresa: 1,
  };

  try {
    // Cadastra a empresa
    const responseEmpresa = await fetch("http://localhost:3000/empresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });

    const dataEmpresa = await responseEmpresa.json();

    if (!responseEmpresa.ok) {
      throw new Error(dataEmpresa.message || "Erro ao cadastrar empresa.");
    }

    document.getElementById("mensagem").innerText =
      "Empresa cadastrada com sucesso!";
    alert(
      "É necessário que seja criado um usuário contendo o mesmo cnpj para o funcionamento do mesmo"
    );
    document.getElementById("cadastroForm").reset();

    // Atualiza a tabela sem precisar recarregar a página
    await carregarEmpresas();
  } catch (error) {
    console.error("Erro ao cadastrar empresa:", error);
    document.getElementById("mensagem").innerText =
      "Erro ao conectar com o servidor.";
  }
}

/**
 * Carrega e exibe as empresas na tabela.
 */
async function carregarEmpresas() {
  try {
    const response = await fetch("http://localhost:3000/empresa");
    const empresas = await response.json();

    const tbody = document.querySelector("#tabelaUsuarios tbody");
    if (!tbody) {
      console.error("Tabela de usuários não encontrada.");
      return;
    }

    tbody.innerHTML = "";

    empresas.forEach((empresa) => {
      const row = document.createElement("tr");
      row.setAttribute("data-id", empresa.idEmpresa);

      row.innerHTML = `
            <td>${empresa.nomeEmpresa}</td>
            <td>${empresa.cnpjEmpresa}</td>
            <td>${empresa.statusEmpresa === 1 ? "Ativo" : "Inativo"}</td>
            <td><i class="fa-solid fa-bars"></i></td>
          `;

      row.addEventListener("click", () =>
        redirecionarParaAjustes(empresa.idEmpresa)
      );

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
  }
}

/**
 * Redireciona para a página de ajustes da empresa.
 * @param {string} idEmpresa - CNPJ da empresa para ajustes.
 */
function redirecionarParaAjustes(idEmpresa) {
  if (idEmpresa) {
    window.location.href = `ajustesEmpresa.html?id=${idEmpresa}`;
  } else {
    console.error("CNPJ da empresa não encontrado!");
  }
}
