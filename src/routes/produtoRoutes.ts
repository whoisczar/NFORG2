import express from "express";
import {
  getAllProdutosController,
  getProdutoByIdController,
  createProdutoController,
  updateProdutoController,
  deleteProdutoController,
  searchProdutosController, // Adicione esta função
} from "../controllers/produtoController";

const router = express.Router();

// Rota para buscar produtos por nome (usando query parameter)
router.get("/search", searchProdutosController); // Exemplo: /produtos/search?q=Mouse

// Outras rotas
router.get("/", getAllProdutosController);
router.get("/:id", getProdutoByIdController);
router.post("/", createProdutoController);
router.put("/:id", updateProdutoController);
router.delete("/:id", deleteProdutoController);

export default router;
