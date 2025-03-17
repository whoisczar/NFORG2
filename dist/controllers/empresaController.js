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
exports.deleteEmpresa = exports.updateEmpresa = exports.createEmpresa = exports.getEmpresaById = exports.getAllEmpresas = void 0;
const db_1 = __importDefault(require("../db"));
const getAllEmpresas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [results] = yield db_1.default.query("SELECT * FROM empresa");
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar empresas", error: err });
    }
});
exports.getAllEmpresas = getAllEmpresas;
const getEmpresaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("SELECT * FROM empresa WHERE idEmpresa = ?", [id]);
        if (!results[0]) {
            res.status(404).json({ message: "Empresa não encontrada" });
        }
        else {
            res.status(200).json(results[0]);
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao buscar empresa", error: err });
    }
});
exports.getEmpresaById = getEmpresaById;
const createEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nomeEmpresa, cnpjEmpresa, statusEmpresa } = req.body;
    try {
        const [results] = yield db_1.default.query("INSERT INTO empresa (nomeEmpresa, cnpjEmpresa, statusEmpresa) VALUES (?, ?, ?)", [nomeEmpresa, cnpjEmpresa, statusEmpresa]);
        res.status(201).json({ id: results.insertId });
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao criar empresa", error: err });
    }
});
exports.createEmpresa = createEmpresa;
const updateEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { nomeEmpresa, cnpjEmpresa, statusEmpresa } = req.body;
    try {
        const [results] = yield db_1.default.query("UPDATE empresa SET nomeEmpresa = ?, cnpjEmpresa = ?, statusEmpresa = ? WHERE idEmpresa = ?", [nomeEmpresa, cnpjEmpresa, statusEmpresa, id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Empresa não encontrada" });
        }
        else {
            res.status(200).json({ message: "Empresa atualizada com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao atualizar empresa", error: err });
    }
});
exports.updateEmpresa = updateEmpresa;
const deleteEmpresa = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const [results] = yield db_1.default.query("DELETE FROM empresa WHERE idEmpresa = ?", [id]);
        if (results.affectedRows === 0) {
            res.status(404).json({ message: "Empresa não encontrada" });
        }
        else {
            res.status(200).json({ message: "Empresa deletada com sucesso" });
        }
    }
    catch (err) {
        res.status(500).json({ message: "Erro ao deletar empresa", error: err });
    }
});
exports.deleteEmpresa = deleteEmpresa;
