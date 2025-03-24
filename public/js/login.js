async function handleLogin(event) {
  event.preventDefault();
  const cpfCnpjClient = document.getElementById("cpf").value;
  const senhaClient = document.getElementById("senha").value;

  const response = await fetch("http://localhost:3000/client/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpfCnpjClient, senhaClient }),
  });

  const data = await response.json();
  alert(data.message);

  if (response.status === 200) {
    // Redireciona para a página desejada
    window.location.href = "../cadastro.html";
    alert(data.message);
  }
}
