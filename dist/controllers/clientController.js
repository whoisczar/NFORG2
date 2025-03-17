"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClient = exports.updateClient = exports.createClient = exports.getClientByCpfCnpj = exports.getAllClients = exports.loginClient = void 0;
const db_1 = __importDefault(require("../db"));
// Endpoint para Loginexport const loginClient = async (req: Request, res: Response): Promise<void> => {
const loginClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpfCnpjClient } = req.body; // Recebe o CPF/CNPJ para login
    console.log(`Tentando fazer login com CPF/CNPJ: ${cpfCnpjClient}`); // Log para depuração
    try {
        // Verifica se o cliente existe no banco de dados pelo CPF
        const [results] = yield db_1.default.query("SELECT * FROM client WHERE cpfCnpjClient = ?", [cpfCnpjClient]);
        console.log(`Resultado da consulta: ${JSON.stringify(results)}`); // Log para depuração
        if (results.length === 0) {
            // Retorna erro caso o CPF não exista
            res.status(404).json({ message: "Cliente não encontrado" });
        }
        else {
            // Cliente encontrado, retorna mensagem de sucesso
            res
                .status(200)
                .json({ message: "Login realizado com sucesso", cpfCnpjClient });
        }
    }
    catch (err) {
        console.error("Erro ao realizar login:", err); // Log do erro
        res.status(500).json({ message: "Erro ao realizar login", error: err });
    }
});
exports.loginClient = loginClient;
const getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [results] = yield db_1.default.query("SELECT * FROM client");
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar clientes", error: err });
    }
});
exports.getAllClients = getAllClients;
const getClientByCpfCnpj = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cpfCnpj = req.params.cpfCnpj;
    try {
        const [results] = yield db_1.default.query("SELECT * FROM client WHERE cpfCnpjClient = ?", [cpfCnpj]);
        if (!results[0]) {
            res.status(404).json({ message: "Cliente não encontrado" });
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar cliente", error: err });
    }
});
exports.getClientByCpfCnpj = getClientByCpfCnpj;
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cpfCnpjClient, nomeClient, emailClient, senhaClient, cargoClient, statusClient, empresa, } = req.body;
    try {
        const [results] = yield db_1.default.query("INSERT INTO client (cpfCnpjClient, nomeClient, emailClient, senhaClient, cargoClient, statusClient, empresa) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            cpfCnpjClient,
            nomeClient,
            emailClient,
            senhaClient,
            cargoClient,
            statusClient,
            empresa,
        ]);
        res.status(201).json({ cpfCnpj: cpfCnpjClient });
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao criar cliente", error: err });
    }
});
exports.createClient = createClient;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cpfCnpj = req.params.cpfCnpj;
    const { nomeClient, emailClient, senhaClient, cargoClient, statusClient, empresa, } = req.body;
    try {
        const [results] = yield db_1.default.query("UPDATE client SET nomeClient = ?, emailClient = ?, senhaClient = ?, cargoClient = ?, statusClient = ?, empresa = ? WHERE cpfCnpjClient = ?", [
            nomeClient,
            emailClient,
            senhaClient,
            cargoClient,
            statusClient,
            empresa,
            cpfCnpj,
        ]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Cliente não encontrado" });
        }
        else {
            res.status(200).json({ message: "Cliente atualizado com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao atualizar cliente", error: err });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cpfCnpj = req.params.cpfCnpj;
    try {
        const [results] = yield db_1.default.query("DELETE FROM client WHERE cpfCnpjClient = ?", [cpfCnpj]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Cliente não encontrado" });
        }
        else {
            res.status(200).json({ message: "Cliente deletado com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao deletar cliente", error: err });
    }
});
exports.deleteClient = deleteClient;
