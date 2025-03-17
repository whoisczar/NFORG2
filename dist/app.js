"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const empresaRoutes_1 = __importDefault(require("./routes/empresaRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const notaFiscalRoutes_1 = __importDefault(require("./routes/notaFiscalRoutes")); // Importe as rotas de nota fiscal
const produtoRoutes_1 = __importDefault(require("./routes/produtoRoutes")); // Importe as rotas de produto
const itemNfRoutes_1 = __importDefault(require("./routes/itemNfRoutes")); // Importe as rotas de itemNf
const app = (0, express_1.default)();
const port = 3000;
// Middleware para parsear JSON
app.use(body_parser_1.default.json());
// Servir arquivos estáticos da pasta 'public'
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Servir arquivos estáticos da pasta 'views'
app.use(express_1.default.static(path_1.default.join(__dirname, "views")));
// Rotas da API
app.use("/empresa", empresaRoutes_1.default);
app.use("/client", clientRoutes_1.default);
app.use("/notaFiscal", notaFiscalRoutes_1.default); // Use as rotas de nota fiscal
app.use("/produto", produtoRoutes_1.default); // Use as rotas de produto
app.use("/itemNf", itemNfRoutes_1.default); // Use as rotas de itemNf
// Rota para servir o arquivo index.html
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
});
// Rota para servir o arquivo dashboard.html
app.get("/dashboard", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "dashboard.html"));
});
// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
