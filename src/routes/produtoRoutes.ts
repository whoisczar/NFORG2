import express from "express";
import {
  getAllProdutosController,
  getProdutoByIdController,
  createProdutoController,
  updateProdutoController,
  deleteProdutoController,
} from "../controllers/produtoController";

const router = express.Router();

// Rota para obter todos os produtos
router.get("/", getAllProdutosController);

// Rota para buscar um produto por ID
router.get("/:id", getProdutoByIdController);

// Rota para criar um novo produto
router.post("/", createProdutoController);

// Rota para atualizar um produto existente
router.put("/:id", updateProdutoController);

// Rota para deletar um produto
router.delete("/:id", deleteProdutoController);

export default router;
