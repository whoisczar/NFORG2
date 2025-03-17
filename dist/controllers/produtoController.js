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
exports.deleteProduto = exports.updateProduto = exports.createProduto = exports.getProdutoById = exports.getAllProdutos = void 0;
const db_1 = __importDefault(require("../db"));
const getAllProdutos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [results] = yield db_1.default.query("SELECT * FROM produto");
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar produtos", error: err });
    }
});
exports.getAllProdutos = getAllProdutos;
const getProdutoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("SELECT * FROM produto WHERE idProduto = ?", [id]);
        if (!results[0]) {
            res.status(404).json({ message: "Produto não encontrado" });
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar produto", error: err });
    }
});
exports.getProdutoById = getProdutoById;
const createProduto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeProduto, eanProduto, valorProduto } = req.body;
    try {
        const [results] = yield db_1.default.query("INSERT INTO produto (nomeProduto, eanProduto, valorProduto) VALUES (?, ?, ?)", [nomeProduto, eanProduto, valorProduto]);
        res.status(201).json({ id: results.insertId });
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao criar produto", error: err });
    }
});
exports.createProduto = createProduto;
const updateProduto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { nomeProduto, eanProduto, valorProduto } = req.body;
    try {
        const [results] = yield db_1.default.query("UPDATE produto SET nomeProduto = ?, eanProduto = ?, valorProduto = ? WHERE idProduto = ?", [nomeProduto, eanProduto, valorProduto, id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Produto não encontrado" });
        }
        else {
            res.status(200).json({ message: "Produto atualizado com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao atualizar produto", error: err });
    }
});
exports.updateProduto = updateProduto;
const deleteProduto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("DELETE FROM produto WHERE idProduto = ?", [id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Produto não encontrado" });
        }
        else {
            res.status(200).json({ message: "Produto deletado com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao deletar produto", error: err });
    }
});
exports.deleteProduto = deleteProduto;
