document.addEventListener("DOMContentLoaded", async function () {
  // Selecionando as tabelas de relatórios
  const relatorioCargo = document.querySelector("#relatorioCargo tbody");
  const relatorioEmpresa = document.querySelector("#relatorioEmpresa tbody");
  const relatorioProdutos = document.querySelector("#relatorioProdutos tbody");
  const relatorioAtivosInativos = document.querySelector(
    "#relatorioAtivosInativos tbody"
  );

  // Função para carregar clientes por cargo
  async function carregarClientesPorCargo() {
    try {
      const response = await fetch(
        "http://localhost:3000/relatorios/clientes-por-cargo"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes por cargo");
      }

      const dados = await response.json();
      console.log(dados);

      // Limpa a tabela antes de preencher
      relatorioCargo.innerHTML = "";

      // Preenche a tabela com os dados
      dados.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.cargoClient}</td>
            <td>${item.total}</td>
          `;
        relatorioCargo.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes por cargo:", error);
    }
  }

  // Função para carregar clientes por empresa
  async function carregarClientesPorEmpresa() {
    try {
      const response = await fetch(
        "http://localhost:3000/relatorios/clientes-por-empresa"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes por empresa");
      }

      const dados = await response.json();
      console.log(dados);
      // Limpa a tabela antes de preencher
      relatorioEmpresa.innerHTML = "";

      // Preenche a tabela com os dados
      dados.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.nomeEmpresa}</td>
            <td>${item.total}</td>
          `;
        relatorioEmpresa.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes por empresa:", error);
    }
  }

  // Função para carregar produtos mais vendidos
  async function carregarProdutosMaisVendidos() {
    try {
      const response = await fetch(
        "http://localhost:3000/relatorios/produtos-mais-vendidos"
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos mais vendidos");
      }

      const dados = await response.json();
      console.log(dados);
      // Limpa a tabela antes de preencher
      relatorioProdutos.innerHTML = "";

      // Preenche a tabela com os dados
      dados.forEach((item) => {
        const row = document.createElement("tr");
        const valorFormatado = parseFloat(item.valorTotalVendido).toFixed(2);

        row.innerHTML = `
          <td>${item.nomeProduto}</td>
          <td>${item.totalVendido}</td>
          <td>R$ ${valorFormatado}</td>
        `;
        relatorioProdutos.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar produtos mais vendidos:", error);
    }
  }
  async function carregarClientesAtivosInativos() {
    try {
      const response = await fetch(
        `http://localhost:3000/relatorios/clientes-ativos-inativos`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar clientes ativos e inativos");
      }

      const dados = await response.json();
      console.log("Dados recebidos:", dados); // Para debug

      relatorioAtivosInativos.innerHTML = "";

      // Mapeia os valores numéricos para texto amigável
      const statusMap = {
        1: { label: "Ativo", class: "status-ativo" },
        0: { label: "Inativo", class: "status-inativo" },
      };

      dados.forEach((item) => {
        const statusInfo = statusMap[item.statusClient] || {
          label: "Desconhecido",
          class: "status-desconhecido",
        };

        const row = document.createElement("tr");
        row.innerHTML = `
          <td><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></td>
          <td>${item.total}</td>
        `;
        relatorioAtivosInativos.appendChild(row);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes ativos/inativos:", error);
      // Adicione feedback visual para o usuário
      relatorioAtivosInativos.innerHTML = `
        <tr>
          <td colspan="2" class="error-message">Erro ao carregar dados. Tente novamente.</td>
        </tr>
      `;
    }
  }

  await Promise.all([
    carregarClientesPorCargo(),
    carregarClientesPorEmpresa(),
    carregarProdutosMaisVendidos(),
    carregarClientesAtivosInativos(),
  ]);
});
