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
exports.deleteItemNf = exports.updateItemNf = exports.createItemNf = exports.getItemNfById = exports.getAllItensNf = void 0;
const db_1 = __importDefault(require("../db"));
const getAllItensNf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [results] = yield db_1.default.query("SELECT * FROM itemNf");
        res.status(200).json(results);
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Erro ao buscar itens da nota fiscal", error: err });
    }
});
exports.getAllItensNf = getAllItensNf;
const getItemNfById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("SELECT * FROM itemNf WHERE idItemNF = ?", [id]);
        if (!results[0]) {
            res.status(404).json({ message: "Item da nota fiscal não encontrado" });
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Erro ao buscar item da nota fiscal", error: err });
    }
});
exports.getItemNfById = getItemNfById;
const createItemNf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { NotaFiscal, Produto, valorItemNF, tipoQtdItemNF, qtdItemNF, impostosItemNF, valorTotItemNF, } = req.body;
    try {
        const [results] = yield db_1.default.query("INSERT INTO itemNf (NotaFiscal, Produto, valorItemNF, tipoQtdItemNF, qtdItemNF, impostosItemNF, valorTotItemNF) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            NotaFiscal,
            Produto,
            valorItemNF,
            tipoQtdItemNF,
            qtdItemNF,
            impostosItemNF,
            valorTotItemNF,
        ]);
        res.status(201).json({ id: results.insertId });
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Erro ao criar item da nota fiscal", error: err });
    }
});
exports.createItemNf = createItemNf;
const updateItemNf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { NotaFiscal, Produto, valorItemNF, tipoQtdItemNF, qtdItemNF, impostosItemNF, valorTotItemNF, } = req.body;
    try {
        const [results] = yield db_1.default.query("UPDATE itemNf SET NotaFiscal = ?, Produto = ?, valorItemNF = ?, tipoQtdItemNF = ?, qtdItemNF = ?, impostosItemNF = ?, valorTotItemNF = ? WHERE idItemNF = ?", [
            NotaFiscal,
            Produto,
            valorItemNF,
            tipoQtdItemNF,
            qtdItemNF,
            impostosItemNF,
            valorTotItemNF,
            id,
        ]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Item da nota fiscal não encontrado" });
        }
        else {
            res
                .status(200)
                .json({ message: "Item da nota fiscal atualizado com sucesso" });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Erro ao atualizar item da nota fiscal", error: err });
    }
});
exports.updateItemNf = updateItemNf;
const deleteItemNf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("DELETE FROM itemNf WHERE idItemNF = ?", [id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Item da nota fiscal não encontrado" });
        }
        else {
            res
                .status(200)
                .json({ message: "Item da nota fiscal deletado com sucesso" });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Erro ao deletar item da nota fiscal", error: err });
    }
});
exports.deleteItemNf = deleteItemNf;
