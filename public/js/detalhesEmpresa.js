document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idEmpresa = urlParams.get("id");

  if (!idEmpresa) {
    document.body.innerHTML = "<h2>Id não encontrado!</h2>";
    return;
  }

  try {
    // Carrega as informações da empresa
    const response = await fetch(`http://localhost:3000/empresa/${idEmpresa}`);
    if (!response.ok) {
      throw new Error("Empresa não encontrada");
    }

    const empresa = await response.json();

    // Preenche os campos com os dados atuais
    document.getElementById("nomeEmpresa").textContent = empresa.nomeEmpresa;
    document.getElementById("cnpjEmpresa").textContent = empresa.cnpjEmpresa;
    document.getElementById("statusEmpresa").textContent =
      empresa.statusEmpresa === 1 ? "Ativo" : "Inativo";

    // Preenche os campos do formulário de edição
    document.getElementById("nome").value = empresa.nomeEmpresa;
    document.getElementById("cnpj").value = empresa.cnpjEmpresa;
    document.getElementById("status").value = empresa.statusEmpresa; // Status da empresa
  } catch (error) {
    console.error("Erro ao carregar detalhes da empresa:", error);
    document.body.innerHTML = "<h2>Erro ao carregar empresa</h2>";
  }

  // Função de atualização de dados da empresa
  const form = document.getElementById("formEdicaoEmpresa");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById("nome").value;
    const cnpj = document.getElementById("cnpj").value;
    const status = document.getElementById("status").value;

    const empresaData = {
      nomeEmpresa: nome,
      cnpjEmpresa: cnpj,
      statusEmpresa: status,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/empresa/${cnpjEmpresa}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(empresaData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar empresa");
      }

      const result = await response.json();
      alert(result.message); // Exibe a mensagem de sucesso ou erro
      window.location.href = "../cadastroEmpresa.html"; // Redireciona para a página de listagem de empresas
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      alert("Erro ao atualizar a empresa.");
    }
  });
});
