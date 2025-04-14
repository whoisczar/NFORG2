import express from "express";
import {
  getClientsByCargoController,
  getClientsByEmpresaController,
  getClientsAtivosInativosController,
  getProdutosMaisVendidosController,
} from "../controllers/relatorioController";

const router = express.Router();

// Relatórios
router.get("/clientes-por-cargo", getClientsByCargoController);
router.get("/clientes-por-empresa", getClientsByEmpresaController);
router.get("/clientes-ativos-inativos", getClientsAtivosInativosController);
router.get("/produtos-mais-vendidos", getProdutosMaisVendidosController);

export default router;
