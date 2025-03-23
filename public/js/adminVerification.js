// Função para exibir o modal
function showVerificationModal() {
  const modal = document.getElementById("verificationModal");
  modal.style.display = "flex";
}

// Função para ocultar o modal
function hideVerificationModal() {
  const modal = document.getElementById("verificationModal");
  modal.style.display = "none";
}

document
  .getElementById("verificationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const cpf = document.getElementById("verificationCpf").value;
    const senha = document.getElementById("verificationSenha").value;

    try {
      const response = await fetch(
        "http://localhost:3000/client/verification",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cpfCnpjClient: cpf, senhaClient: senha }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.isSuperUser) {
          // Se o cargo for admin ou gerente, permite o acesso
          hideVerificationModal();
          alert("Acesso permitido!");
        } else {
          // Se o cargo não for válido, exibe uma mensagem de erro
          document.getElementById("verificationMessage").innerText =
            "Acesso negado. Cargo não autorizado.";
          // Redireciona para a página de login
          window.location.href = "../index.html";
        }
      } else {
        // Exibe a mensagem de erro do servidor
        document.getElementById("verificationMessage").innerText = data.message;
      }
    } catch (error) {
      console.error("Erro ao verificar cargo:", error);
      document.getElementById("verificationMessage").innerText =
        "Erro ao conectar com o servidor.";
    }
  });
