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
exports.deleteHistorico = exports.updateHistorico = exports.createHistorico = exports.getHistoricoById = exports.getAllHistoricos = void 0;
const db_1 = __importDefault(require("../db"));
const getAllHistoricos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [results] = yield db_1.default.query("SELECT * FROM historico");
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar históricos", error: err });
    }
});
exports.getAllHistoricos = getAllHistoricos;
const getHistoricoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("SELECT * FROM historico WHERE idHistorico = ?", [id]);
        if (!results[0]) {
            res.status(404).json({ message: "Histórico não encontrado" });
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar histórico", error: err });
    }
});
exports.getHistoricoById = getHistoricoById;
const createHistorico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { client, observacaoHistorico, dataHistorico } = req.body;
    try {
        const [results] = yield db_1.default.query("INSERT INTO historico (client, observacaoHistorico, dataHistorico) VALUES (?, ?, ?)", [client, observacaoHistorico, dataHistorico]);
        res.status(201).json({ id: results.insertId });
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao criar histórico", error: err });
    }
});
exports.createHistorico = createHistorico;
const updateHistorico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { client, observacaoHistorico, dataHistorico } = req.body;
    try {
        const [results] = yield db_1.default.query("UPDATE historico SET client = ?, observacaoHistorico = ?, dataHistorico = ? WHERE idHistorico = ?", [client, observacaoHistorico, dataHistorico, id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Histórico não encontrado" });
        }
        else {
            res.status(200).json({ message: "Histórico atualizado com sucesso" });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: "Erro ao atualizar histórico", error: err });
    }
});
exports.updateHistorico = updateHistorico;
const deleteHistorico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("DELETE FROM historico WHERE idHistorico = ?", [id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Histórico não encontrado" });
        }
        else {
            res.status(200).json({ message: "Histórico deletado com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao deletar histórico", error: err });
    }
});
exports.deleteHistorico = deleteHistorico;
