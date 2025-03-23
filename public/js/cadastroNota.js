document.addEventListener("DOMContentLoaded", function () {
  const formNota = document.getElementById("formNota");
  const selectEmpresa = document.getElementById("empresa");
  const pesquisaProduto = document.getElementById("pesquisaProduto");
  const btnPesquisar = document.getElementById("btnPesquisar");
  const resultadosPesquisa = document.getElementById("resultadosPesquisa");
  const produtosAdicionados = document.getElementById("produtosAdicionados");

  let produtosEncontrados = []; // Variável global para armazenar os produtos encontrados
  let produtosSelecionados = []; // Variável global para armazenar os produtos selecionados

  // Função para carregar empresas
  async function carregarEmpresas() {
    try {
      const response = await fetch("http://localhost:3000/empresa");
      if (!response.ok) {
        throw new Error("Erro ao buscar empresas");
      }
      const empresas = await response.json();
      exibirEmpresas(empresas);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    }
  }

  // Função para exibir empresas no select
  function exibirEmpresas(empresas) {
    selectEmpresa.innerHTML = empresas
      .map(
        (empresa) => `
              <option value="${empresa.idEmpresa}">${empresa.nomeEmpresa} (${empresa.cnpjEmpresa})</option>
            `
      )
      .join("");
  }

  // Função para buscar produtos
  async function buscarProdutos(query) {
    try {
      const response = await fetch(
        `http://localhost:3000/produto/search?q=${query}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      produtosEncontrados = await response.json(); // Atualiza a variável global
      exibirResultados(produtosEncontrados);
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  }

  // Função para exibir resultados da pesquisa de produtos
  function exibirResultados(produtos) {
    resultadosPesquisa.innerHTML = produtos
      .map(
        (produto) => `
              <div class="produto">
                <span>${produto.nomeProduto} - R$ ${produto.valorProduto}</span>
                <button onclick="adicionarProduto(${produto.idProduto})">Adicionar</button>
              </div>
            `
      )
      .join("");
  }

  // Função para limpar resultados da pesquisa
  function limparResultadosPesquisa() {
    resultadosPesquisa.innerHTML = "";
  }

  // Função para adicionar produto à nota
  window.adicionarProduto = function (id) {
    const produto = produtosSelecionados.find((p) => p.idProduto === id);
    if (produto) {
      // Se o produto já existe, incrementa a quantidade
      produto.quantidade += 1;
    } else {
      // Se o produto não existe, adiciona à lista com quantidade 1
      const novoProduto = produtosEncontrados.find((p) => p.idProduto === id);
      if (novoProduto) {
        produtosSelecionados.push({ ...novoProduto, quantidade: 1 });
      }
    }
    atualizarListaProdutos();
    limparResultadosPesquisa();

    // Feedback visual
    const produtoAdicionado = document.querySelector(
      `.produto button[onclick="adicionarProduto(${id})"]`
    );
    if (produtoAdicionado) {
      produtoAdicionado.textContent = "Adicionado!";
      produtoAdicionado.disabled = true;
      setTimeout(() => {
        produtoAdicionado.textContent = "Adicionar";
        produtoAdicionado.disabled = false;
      }, 2000); // Remove o feedback após 2 segundos
    }
  };

  // Função para atualizar a lista de produtos adicionados
  function atualizarListaProdutos() {
    produtosAdicionados.innerHTML = produtosSelecionados
      .map(
        (produto) => `
              <li>
                <span>${produto.nomeProduto} - R$ ${produto.valorProduto}</span>
                <input type="number" value="${produto.quantidade}" min="1" onchange="atualizarQuantidade(${produto.idProduto}, this.value)" />
                <button onclick="removerProduto(${produto.idProduto})">Remover</button>
              </li>
            `
      )
      .join("");
  }

  // Função para atualizar a quantidade de um produto
  window.atualizarQuantidade = function (id, quantidade) {
    const produto = produtosSelecionados.find((p) => p.idProduto === id);
    if (produto) {
      produto.quantidade = parseInt(quantidade, 10);
    }
  };

  // Função para remover um produto
  window.removerProduto = function (id) {
    produtosSelecionados = produtosSelecionados.filter(
      (p) => p.idProduto !== id
    );
    atualizarListaProdutos();
  };

  // Evento de pesquisa de produtos
  btnPesquisar.addEventListener("click", async function () {
    const query = pesquisaProduto.value;
    if (query) {
      await buscarProdutos(query);
    }
  });

  // Evento de envio do formulário
  formNota.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Validação básica
    if (!selectEmpresa.value) {
      alert("Selecione uma empresa.");
      return;
    }
    if (!formNota.dataNotaFiscal.value) {
      alert("Informe a data da nota fiscal.");
      return;
    }
    if (produtosSelecionados.length === 0) {
      alert("Adicione pelo menos um produto à nota.");
      return;
    }

    const nota = {
      idEmpresa: selectEmpresa.value, // ID da empresa selecionada
      dataNotaFiscal: formNota.dataNotaFiscal.value,
      produtos: produtosSelecionados,
    };

    try {
      const response = await fetch("http://localhost:3000/notaFiscal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nota),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Tenta obter detalhes do erro
        throw new Error(errorData.message || "Erro ao cadastrar nota");
      }

      alert("Nota cadastrada com sucesso!");
      formNota.reset();
      produtosSelecionados = [];
      atualizarListaProdutos();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message); // Exibe a mensagem de erro detalhada
    }
  });

  // Carregar empresas ao iniciar a página
  carregarEmpresas();
});
