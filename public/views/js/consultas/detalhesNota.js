document.addEventListener("DOMContentLoaded", function () {
  // Obtém o ID da nota fiscal da URL
  const urlParams = new URLSearchParams(window.location.search);
  const idNotaFiscal = urlParams.get("id");

  if (!idNotaFiscal) {
    alert("ID da nota fiscal não encontrado na URL.");
    return;
  }

  // Função para carregar os detalhes da nota fiscal
  async function carregarDetalhesNota(idNotaFiscal) {
    try {
      // Faz a requisição para o endpoint de detalhes da nota fiscal
      const response = await fetch(
        `http://localhost:3000/notaFiscal/${idNotaFiscal}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar detalhes da nota fiscal");
      }
      const notaFiscal = await response.json();
      console.log("Nota Fiscal:", notaFiscal);
      exibirDetalhesNota(notaFiscal);

      // Adiciona os eventos de exportação após carregar os dados
      adicionarEventosExportacao(notaFiscal);
    } catch (error) {
      console.error("Erro:", error);
      alert(
        "Erro ao carregar detalhes da nota fiscal. Verifique o console para mais detalhes."
      );
    }
  }

  // Função para exibir os detalhes da nota fiscal
  function exibirDetalhesNota(notaFiscal) {
    // Exibe as informações da nota fiscal
    document.getElementById("idNotaFiscal").textContent =
      notaFiscal.idNotaFiscal;
    document.getElementById("nomeEmpresa").textContent = notaFiscal.nomeEmpresa;
    document.getElementById("dataNotaFiscal").textContent = new Date(
      notaFiscal.dataNotaFiscal
    ).toLocaleDateString();
    document.getElementById(
      "valorNotaFiscal"
    ).textContent = `R$ ${notaFiscal.valorNotaFiscal}`;

    // Exibe os produtos da nota fiscal (se existirem)
    const tabelaProdutos = document
      .getElementById("tabelaProdutos")
      .getElementsByTagName("tbody")[0];
    tabelaProdutos.innerHTML = ""; // Limpa a tabela antes de adicionar novos dados

    if (notaFiscal.produtos && notaFiscal.produtos.length > 0) {
      notaFiscal.produtos.forEach((produto) => {
        const row = tabelaProdutos.insertRow();
        row.insertCell().textContent = produto.nomeProduto;
        row.insertCell().textContent = produto.quantidade;
        row.insertCell().textContent = produto.tipoQtdItemNF;
        row.insertCell().textContent = `R$ ${produto.valorProduto}`;
        row.insertCell().textContent = `R$ ${parseFloat(
          produto.impostosItemNF
        ).toFixed(2)}`; // Impostos
        row.insertCell().textContent = `R$ ${(
          produto.valorProduto * produto.quantidade
        ).toFixed(2)}`;
      });
    } else {
      const row = tabelaProdutos.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 4; // Mescla as colunas
      cell.textContent = "Nenhum produto encontrado para esta nota fiscal.";
      cell.style.textAlign = "center";
    }
  }
  // Função para formatar a data e hora corretamente
  function formatarDataHoraBrasileira(data) {
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Função para formatar data no nome do arquivo (YYYY-MM-DD_HH-MM-SS)
  function formatarDataParaArquivo(data) {
    return data
      .toISOString()
      .replace("T", "_")
      .replace(/:/g, "-")
      .split(".")[0]; // Remove milissegundos
  }
  // Função para adicionar eventos de exportação
  function adicionarEventosExportacao(notaFiscal) {
    // Exportar para PDF
    document.getElementById("exportarPdf").addEventListener("click", () => {
      exportarParaPdf(notaFiscal);
    });

    // Exportar para CSV
    document.getElementById("exportarCsv").addEventListener("click", () => {
      exportarParaCsv(notaFiscal);
    });
  }

  // Função para exportar os dados para PDF
  function exportarParaPdf(notaFiscal) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margemEsquerda = 10;
    let posicaoY = 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(
      `Nota Fiscal: ${notaFiscal.idNotaFiscal}`,
      margemEsquerda,
      posicaoY
    );
    posicaoY += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Empresa: ${notaFiscal.nomeEmpresa}`, margemEsquerda, posicaoY);
    posicaoY += 8;

    const dataNotaFiscal = new Date(notaFiscal.dataNotaFiscal);
    const dataGerada = new Date();

    doc.text(
      `Data: ${formatarDataHoraBrasileira(dataNotaFiscal)}`,
      margemEsquerda,
      posicaoY
    );
    posicaoY += 8;
    doc.text(
      `Gerada em: ${formatarDataHoraBrasileira(dataGerada)}`,
      margemEsquerda,
      posicaoY
    );
    posicaoY += 8;

    doc.setFont("helvetica", "bold");
    doc.text(
      `Valor Total: R$ ${notaFiscal.valorNotaFiscal}`,
      margemEsquerda,
      posicaoY
    );
    posicaoY += 10;

    if (notaFiscal.produtos && notaFiscal.produtos.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Produtos:", margemEsquerda, posicaoY);
      posicaoY += 8;

      doc.setFontSize(11);
      doc.text("Nome", margemEsquerda, posicaoY);
      doc.text("Qtd", margemEsquerda + 80, posicaoY);
      doc.text("Preço Un.", margemEsquerda + 100, posicaoY);
      doc.text("Total", margemEsquerda + 140, posicaoY);
      doc.line(margemEsquerda, posicaoY + 2, 200, posicaoY + 2);
      posicaoY += 6;

      doc.setFont("helvetica", "normal");
      notaFiscal.produtos.forEach((produto) => {
        doc.text(produto.nomeProduto, margemEsquerda, posicaoY);
        doc.text(`${produto.quantidade}`, margemEsquerda + 80, posicaoY);
        doc.text(`R$ ${produto.valorProduto}`, margemEsquerda + 100, posicaoY);
        doc.text(
          `R$ ${(produto.valorProduto * produto.quantidade).toFixed(2)}`,
          margemEsquerda + 140,
          posicaoY
        );
        posicaoY += 8;
      });
    } else {
      doc.text("Nenhum produto encontrado.", margemEsquerda, posicaoY);
    }

    const larguraPagina = doc.internal.pageSize.width;
    const alturaPagina = doc.internal.pageSize.height;

    doc.line(10, alturaPagina - 15, larguraPagina - 10, alturaPagina - 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Gerado por NFORG by WhoIsCzar",
      larguraPagina / 2,
      alturaPagina - 10,
      { align: "center" }
    );

    const dataFormatadaArquivo = formatarDataParaArquivo(dataGerada);
    doc.save(
      `NF_${notaFiscal.idNotaFiscal}_${notaFiscal.nomeEmpresa}_${dataFormatadaArquivo}.pdf`
    );
  }

  // Função para exportar os dados para CSV
  function exportarParaCsv(notaFiscal) {
    function formatarDataParaCsv(data) {
      return (
        data.toLocaleDateString("pt-BR") +
        " " +
        data.toLocaleTimeString("pt-BR")
      );
    }

    const dataNotaFiscal = new Date(notaFiscal.dataNotaFiscal);
    const dataGerada = new Date();

    let conteudoCsv = "\uFEFF";
    conteudoCsv += `"Nota Fiscal","Empresa","Data","Valor Total"\n`;
    conteudoCsv += `"${notaFiscal.idNotaFiscal}","${
      notaFiscal.nomeEmpresa
    }","${formatarDataParaCsv(dataNotaFiscal)}","${
      notaFiscal.valorNotaFiscal
    }"\n\n`;

    conteudoCsv += `"Produto","Quantidade","Valor Unitário","Valor Total"\n`;

    if (notaFiscal.produtos && notaFiscal.produtos.length > 0) {
      notaFiscal.produtos.forEach((produto) => {
        conteudoCsv += `"${produto.nomeProduto}","${produto.quantidade}","${
          produto.valorProduto
        }","${(produto.valorProduto * produto.quantidade).toFixed(2)}"\n`;
      });
    } else {
      conteudoCsv += `"Nenhum produto encontrado."\n`;
    }

    const blob = new Blob([conteudoCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NF_${notaFiscal.idNotaFiscal}_${
      notaFiscal.nomeEmpresa
    }_${formatarDataParaArquivo(dataGerada)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Carrega os detalhes da nota fiscal ao iniciar a página
  carregarDetalhesNota(idNotaFiscal);
});
