import express from "express";
import {
  getAllProdutosController,
  getProdutoByIdController,
  createProdutoController,
  updateProdutoController,
  deleteProdutoController,
  searchProdutosController,
  getProdutosMaisVendidosController,
} from "../controllers/produtoController";

const router = express.Router();

// Rota para buscar produtos por nome (usando query parameter)
router.get("/search", searchProdutosController); // Exemplo: /produtos/search?q=Mouse
// Rota para buscar produtos por mais vendido (usando query parameter)
router.get("/mais-vendidos", getProdutosMaisVendidosController);
// Outras rotas
router.get("/", getAllProdutosController);
router.get("/:id", getProdutoByIdController);
router.post("/", createProdutoController);
router.put("/:id", updateProdutoController);
router.delete("/:id", deleteProdutoController);

export default router;
