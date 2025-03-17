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
exports.addProdutoToNotaFiscal = exports.getProdutosByNotaFiscal = exports.deleteNotaFiscal = exports.updateNotaFiscal = exports.createNotaFiscal = exports.getNotaFiscalById = exports.getAllNotasFiscais = void 0;
const db_1 = __importDefault(require("../db"));
// Função para lidar com erros
const handleError = (err, res, message) => {
    console.error(message, err);
    res.status(500).json({ message, error: err });
};
const getAllNotasFiscais = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
            SELECT nf.idNotaFiscal, nf.valorNotaFiscal, nf.dataNotaFiscal, nf.dataNotaCadastrada, nf.cpf_cnpj, c.nomeClient
            FROM notafiscal nf
            JOIN client c ON nf.cpf_cnpj = c.cpfCnpjClient
        `;
        console.log("Executando consulta SQL:", query); // Log da consulta
        const [results] = yield db_1.default.query(query);
        console.log("Resultados da consulta:", results); // Log dos resultados
        res.status(200).json(results);
    }
    catch (err) {
        console.error("Erro completo:", err); // Log completo do erro
        handleError(err, res, "Erro ao buscar notas fiscais");
    }
});
exports.getAllNotasFiscais = getAllNotasFiscais;
const getNotaFiscalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const query = `
        SELECT nf.idNotaFiscal, nf.valorNotaFiscal, nf.dataNotaFiscal, nf.dataNotaCadastrada, nf.cpf_cnpj, c.nomeClient
        FROM notafiscal nf
        JOIN client c ON nf.cpf_cnpj = c.cpfCnpjClient
        WHERE nf.idNotaFiscal = ?
      `;
        const [results] = yield db_1.default.query(query, [id]);
        if (!results[0]) {
            res.status(404).json({ message: "Nota fiscal não encontrada" });
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    catch (err) {
        console.error("Erro ao buscar nota fiscal:", err);
        res.status(500).json({ message: "Erro ao buscar nota fiscal", error: err });
    }
});
exports.getNotaFiscalById = getNotaFiscalById;
const createNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj } = req.body;
    try {
        const [results] = yield db_1.default.query("INSERT INTO notafiscal (valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj) VALUES (?, ?, ?, ?)", [valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj]);
        res.status(201).json({ id: results.insertId });
    }
    catch (err) {
        handleError(err, res, "Erro ao criar nota fiscal");
    }
});
exports.createNotaFiscal = createNotaFiscal;
const updateNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj } = req.body;
    try {
        const [results] = yield db_1.default.query("UPDATE notafiscal SET valorNotaFiscal = ?, dataNotaFiscal = ?, dataNotaCadastrada = ?, cpf_cnpj = ? WHERE idNotaFiscal = ?", [valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj, id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Nota fiscal não encontrada" });
        }
        else {
            res.status(200).json({ message: "Nota fiscal atualizada com sucesso" });
        }
    }
    catch (err) {
        handleError(err, res, "Erro ao atualizar nota fiscal");
    }
});
exports.updateNotaFiscal = updateNotaFiscal;
const deleteNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log("Recebido pedido para deletar nota fiscal com ID:", id);
    try {
        // Start a transaction to ensure atomicity
        yield db_1.default.beginTransaction();
        // Step 1: Delete related records in `itemNf`
        yield db_1.default.query("DELETE FROM itemNf WHERE NotaFiscal = ?", [id]);
        // Step 2: Delete the record from `notaFiscal`
        const [results] = yield db_1.default.query("DELETE FROM notaFiscal WHERE idNotaFiscal = ?", [id]);
        // Commit the transaction
        yield db_1.default.commit();
        console.log("Resultados da query:", results);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Nota fiscal não encontrada" });
        }
        else {
            res
                .status(200)
                .json({
                message: "Nota fiscal e itens relacionados deletados com sucesso",
            });
        }
    }
    catch (err) {
        // Rollback the transaction in case of error
        yield db_1.default.rollback();
        console.error("Erro ao deletar nota fiscal:", err);
        handleError(err, res, "Erro ao deletar nota fiscal");
    }
});
exports.deleteNotaFiscal = deleteNotaFiscal;
// Obter todos os produtos de uma nota fiscal
const getProdutosByNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idNotaFiscal = req.params.id;
    try {
        const [produtos] = yield db_1.default.query("SELECT * FROM produtos WHERE idNotaFiscal = ?", [idNotaFiscal]);
        if (produtos.length === 0) {
            res
                .status(404)
                .json({ message: "Nenhum produto encontrado para esta nota fiscal" });
        }
        else {
            res.status(200).json(produtos);
        }
    }
    catch (err) {
        handleError(err, res, "Erro ao buscar produtos");
    }
});
exports.getProdutosByNotaFiscal = getProdutosByNotaFiscal;
// Adicionar um produto à nota fiscal
const addProdutoToNotaFiscal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idNotaFiscal = req.params.id;
    const { descricao, quantidade, preco } = req.body;
    try {
        // Verificar se o produto já está registrado na nota fiscal
        const [produtoExistente] = yield db_1.default.query("SELECT * FROM produtos WHERE descricao = ? AND idNotaFiscal = ?", [descricao, idNotaFiscal]);
        // Se o produto já existir, retornar erro
        if (produtoExistente.length > 0) {
            return res
                .status(400)
                .json({ message: "Produto já cadastrado nesta nota fiscal." });
        }
        // Se o produto não existir, adicionar à nota fiscal
        const [result] = yield db_1.default.query("INSERT INTO produtos (idNotaFiscal, descricao, quantidade, preco) VALUES (?, ?, ?, ?)", [idNotaFiscal, descricao, quantidade, preco]);
        return res.status(201).json({
            message: "Produto adicionado com sucesso",
            idProduto: result.insertId,
        });
    }
    catch (err) {
        console.error("Erro ao adicionar produto:", err); // Log do erro
        return res
            .status(500)
            .json({ message: "Erro ao adicionar produto", error: err });
    }
});
exports.addProdutoToNotaFiscal = addProdutoToNotaFiscal;
