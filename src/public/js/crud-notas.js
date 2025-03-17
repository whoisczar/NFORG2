document.addEventListener("DOMContentLoaded", () => {
  const notaFiscalList = document.getElementById("notaFiscalList");
  const formNota = document.getElementById("form-nota");
  const valorNotaFiscal = document.getElementById("valorNotaFiscal");
  const dataNotaFiscal = document.getElementById("dataNotaFiscal");
  const cpf_cnpj = document.getElementById("cpf_cnpj");
  const modalCriarNota = new bootstrap.Modal(
    document.getElementById("modalCriarNota")
  );
  let editingId = null;

  // Função para carregar todas as notas fiscais
  async function loadNotasFiscais() {
    try {
      const response = await fetch("/api/notas-fiscais");
      const notas = await response.json();

      notaFiscalList.innerHTML = ""; // Limpar lista antes de inserir novamente

      notas.forEach((nota) => {
        const listItem = document.createElement("div");
        listItem.classList.add(
          "list-group-item",
          "d-flex",
          "justify-content-between",
          "align-items-center"
        );

        listItem.innerHTML = `
            <div>
              <strong>Valor:</strong> ${nota.valorNotaFiscal} <br>
              <strong>Data:</strong> ${nota.dataNotaFiscal} <br>
              <strong>CPF/CNPJ:</strong> ${nota.cpf_cnpj}
            </div>
            <div>
              <button class="btn btn-warning btn-sm edit-button" data-id="${nota.idNotaFiscal}">Editar</button>
              <button class="btn btn-danger btn-sm delete-button" data-id="${nota.idNotaFiscal}">Excluir</button>
            </div>
          `;

        // Adiciona a nota à lista
        notaFiscalList.appendChild(listItem);
      });

      // Adiciona eventos de edição
      const editButtons = document.querySelectorAll(".edit-button");
      editButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          loadNotaForEditing(id);
        });
      });

      // Adiciona eventos de exclusão
      const deleteButtons = document.querySelectorAll(".delete-button");
      deleteButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          deleteNotaFiscal(id);
        });
      });
    } catch (err) {
      console.error("Erro ao carregar as notas fiscais:", err);
    }
  }

  // Função para carregar uma nota fiscal específica para edição
  async function loadNotaForEditing(id) {
    try {
      const response = await fetch(`/api/notas-fiscais/${id}`);
      const nota = await response.json();

      editingId = id;
      valorNotaFiscal.value = nota.valorNotaFiscal;
      dataNotaFiscal.value = nota.dataNotaFiscal;
      cpf_cnpj.value = nota.cpf_cnpj;

      modalCriarNota.show();
    } catch (err) {
      console.error("Erro ao carregar nota para edição:", err);
    }
  }

  // Função para deletar uma nota fiscal
  async function deleteNotaFiscal(id) {
    try {
      const response = await fetch(`/api/notas-fiscais/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Nota fiscal deletada com sucesso!");
        loadNotasFiscais(); // Recarrega a lista após a exclusão
      } else {
        alert("Erro ao deletar nota fiscal");
      }
    } catch (err) {
      console.error("Erro ao excluir nota fiscal:", err);
    }
  }

  // Submissão do formulário de criação/edição
  formNota.addEventListener("submit", async (event) => {
    event.preventDefault();

    const notaData = {
      valorNotaFiscal: valorNotaFiscal.value,
      dataNotaFiscal: dataNotaFiscal.value,
      cpf_cnpj: cpf_cnpj.value,
    };

    try {
      let response;
      if (editingId) {
        // Atualizar nota
        response = await fetch(`/api/notas-fiscais/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notaData),
        });
      } else {
        // Criar nova nota
        response = await fetch("/api/notas-fiscais", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notaData),
        });
      }

      if (response.ok) {
        alert("Nota fiscal salva com sucesso!");
        loadNotasFiscais(); // Recarrega a lista de notas fiscais
        modalCriarNota.hide(); // Fecha o modal
        editingId = null; // Reseta o id da nota que está sendo editada
      } else {
        alert("Erro ao salvar a nota fiscal");
      }
    } catch (err) {
      console.error("Erro ao salvar nota fiscal:", err);
    }
  });

  // Carregar as notas fiscais quando a página for carregada
  loadNotasFiscais();
});
