import express from "express";
import {
  getAllEmpresas,
  getEmpresaById,
  createEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../controllers/empresaController";

const router = express.Router();

// Rota para obter todas as empresas
router.get("/", getAllEmpresas);

// Rota para buscar empresa por ID
router.get("/:id", getEmpresaById);

// Rota para criar uma nova empresa
router.post("/", createEmpresa);

// Rota para atualizar uma empresa existente
router.put("/:id", updateEmpresa);

// Rota para deletar uma empresa pelo ID
router.delete("/:id", deleteEmpresa);

export default router;
