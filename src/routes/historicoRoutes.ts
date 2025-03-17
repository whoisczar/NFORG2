import express from "express";
import {
  getAllHistoricos,
  getHistoricoById,
  createHistorico,
  updateHistorico,
  deleteHistorico,
} from "../controllers/historicoController";

const router = express.Router();

// Rota para obter todos os históricos
router.get("/", getAllHistoricos);

// Rota para buscar histórico por ID
router.get("/:id", getHistoricoById);

// Rota para criar um novo histórico
router.post("/", createHistorico);

// Rota para atualizar um histórico existente
router.put("/:id", updateHistorico);

// Rota para deletar um histórico pelo ID
router.delete("/:id", deleteHistorico);

export default router;
