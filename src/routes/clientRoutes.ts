const express = require("express");
const {
  getAllClients,
  getClientByCpfCnpj,
  createClient,
  updateClient,
  deleteClient,
  loginClient,
} = require("../controllers/clientController");

const router = express.Router();

// Rota para realizar login do cliente
router.post("/login", loginClient);

// Rota para obter todos os clientes
router.get("/", getAllClients);

// Rota para buscar cliente por CPF/CNPJ
router.get("/:cpfCnpj", getClientByCpfCnpj);

// Rota para criar um novo cliente
router.post("/", createClient);

// Rota para atualizar um cliente existente
router.put("/:cpfCnpj", updateClient);

// Rota para deletar um cliente pelo CPF/CNPJ
router.delete("/:cpfCnpj", deleteClient);

export default router;
