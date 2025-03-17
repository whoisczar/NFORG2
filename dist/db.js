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
const promise_1 = __importDefault(require("mysql2/promise"));
const connection = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "gerenciador",
});
// Teste de conexão
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield connection.query("SELECT 1 + 1 AS result");
        console.log("Conexão com o banco de dados estabelecida com sucesso:", rows);
    }
    catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    }
}))();
exports.default = connection;
