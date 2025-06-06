import express from "express";
import {
  getAllNotasFiscaisController,
  getNotaFiscalByIdController,
  createNotaFiscalController,
  updateNotaFiscalController,
  deleteNotaFiscalController,
  searchNotaFiscalController, // Importe o novo controller
} from "../controllers/notaFiscalController";

const router = express.Router();

// Rota para obter todas as notas fiscais
router.get("/", getAllNotasFiscaisController);

// Rota para buscar notas fiscais por nome da empresa
router.get("/search", searchNotaFiscalController); // Exemplo: /notaFiscal/search?empresa=Empresa+Exemplo

// Rota para buscar uma nota fiscal por ID
router.get("/:id", getNotaFiscalByIdController);

// Rota para criar uma nova nota fiscal
router.post("/", createNotaFiscalController);

// Rota para atualizar uma nota fiscal existente
router.put("/:id", updateNotaFiscalController);

// Rota para deletar uma nota fiscal pelo ID
router.delete("/:id", deleteNotaFiscalController);

export default router;
