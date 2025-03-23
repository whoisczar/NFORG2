import express from "express";
import bodyParser from "body-parser";
import path from "path";
import empresaRoutes from "./routes/empresaRoutes";
import clientRoutes from "./routes/clientRoutes";
import notaFiscalRoutes from "./routes/notaFiscalRoutes";
import produtoRoutes from "./routes/produtoRoutes";
import itemNfRoutes from "./routes/itemNfRoutes";

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware para parsear dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));

// Servir arquivos estáticos a partir da pasta 'public'
app.use(express.static(path.join(__dirname, "..", "public")));

// Rotas da API
app.use("/empresa", empresaRoutes);
app.use("/client", clientRoutes);
app.use("/notaFiscal", notaFiscalRoutes);
app.use("/produto", produtoRoutes);
app.use("/itemNf", itemNfRoutes);

// Rota para servir o arquivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Rota para servir o arquivo dashboard.html
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "dashboard.html"));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
