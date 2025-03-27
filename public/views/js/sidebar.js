document.addEventListener("DOMContentLoaded", function () {
  const menuItems = [
    {
      icon: "fas fa-home",
      text: " Dashboard",
      href: "../dashboard.html",
    },
    {
      icon: "fas fa-search",
      text: " Consultar notas",
      href: "../consultaNotaFiscal.html", // Link vazio ou ação personalizada
    },
    {
      icon: "fas fa-edit",
      text: " Cadastrar notas",
      href: "../cadastroNotasFiscais.html",
    },
    {
      icon: "fas fa-users",
      text: " Cadastro de Usuários",
      href: "../cadastroUsuario.html", // Link vazio ou ação personalizada
    },
    {
      icon: "fas fa-industry",
      text: " Cadastro de Empresas",
      href: "../cadastroEmpresa.html", // Link vazio ou ação personalizada
    },
    {
      icon: "fas fa-barcode",
      text: " Cadastro de Produtos",
      href: "../cadastroProduto.html", // Link vazio ou ação personalizada
    },
  ];

  const sidebarList = document.querySelector(".sidebar ul");

  // Verifica se o elemento ul foi encontrado
  if (!sidebarList) {
    console.error("Elemento ul não encontrado!");
    return;
  }

  // Gera os itens do menu
  menuItems.forEach((item) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.classList.add("menu-item");
    if (item.href) {
      button.setAttribute("data-href", item.href);
    }

    // Ícone
    const icon = document.createElement("i");
    icon.className = item.icon;
    button.appendChild(icon);

    // Texto
    const text = document.createElement("span");
    text.classList.add("menu-text");
    text.textContent = item.text;
    button.appendChild(text);

    // Adiciona o botão ao li
    li.appendChild(button);

    // Adiciona o li ao ul
    sidebarList.appendChild(li);
  });
});

document.getElementById("toggleSidebar").addEventListener("click", function () {
  const sidebar = document.querySelector(".sidebar");
  const content = document.querySelector(".content");
  const menuTexts = document.querySelectorAll(".menu-text");

  // Alternar classes para recolher/expandir a sidebar e o conteúdo
  sidebar.classList.toggle("collapsed");
  content.classList.toggle("expanded");

  // Alternar a visibilidade do texto dos botões
  menuTexts.forEach((text) => {
    if (text.style.display === "none") {
      text.style.display = "inline"; // Mostrar o texto
    } else {
      text.style.display = "none"; // Esconder o texto
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os botões do menu
  const botoesMenu = document.querySelectorAll(".menu-item[data-href]");

  // Adiciona um evento de clique a cada botão
  botoesMenu.forEach((botao) => {
    botao.addEventListener("click", () => {
      // Obtém o valor do atributo data-href
      const href = botao.getAttribute("data-href");

      // Redireciona para a página correspondente
      if (href) {
        window.location.href = href;
      }
    });
  });
});
