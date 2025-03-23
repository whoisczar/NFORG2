import express from "express";
import {
  getAllClientsController,
  getClientByCpfCnpjController,
  createClientController,
  updateClientController,
  deleteClientController, // Corrigido para o nome certo da função
  loginClientController,
  cargoVerificationController,
} from "../controllers/clientController";

const router = express.Router();

// Rota de login
router.post("/login", loginClientController);

router.post("/verificar", cargoVerificationController);

// Rota para obter todos os clientes
router.get("/", getAllClientsController);

// Rota para buscar cliente por CPF/CNPJ
router.get("/:cpfCnpj", getClientByCpfCnpjController);

// Rota para criar um novo cliente
router.post("/", createClientController);

// Rota para atualizar um cliente existente
router.put("/:cpfCnpj", updateClientController);

// Rota para deletar um cliente pelo CPF/CNPJ
router.delete("/:cpfCnpj", deleteClientController); // Corrigido para usar a função correta

export default router;
