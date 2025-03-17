import express from "express";
import {
  getAllItensNf,
  getItemNfById,
  createItemNf,
  updateItemNf,
  deleteItemNf,
} from "../controllers/itemNfController";

const router = express.Router();

// Rota para obter todos os itens da nota fiscal
router.get("/", getAllItensNf);

// Rota para buscar item da nota fiscal por ID
router.get("/:id", getItemNfById);

// Rota para criar um novo item na nota fiscal
router.post("/", createItemNf);

// Rota para atualizar um item existente da nota fiscal
router.put("/:id", updateItemNf);

// Rota para deletar um item da nota fiscal pelo ID
router.delete("/:id", deleteItemNf);

export default router;
