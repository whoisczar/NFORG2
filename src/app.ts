import express from "express";
import bodyParser from "body-parser";
import path from "path";
import empresaRoutes from "./routes/empresaRoutes";
import clientRoutes from "./routes/clientRoutes";
import notaFiscalRoutes from "./routes/notaFiscalRoutes"; // Importe as rotas de nota fiscal
import produtoRoutes from "./routes/produtoRoutes"; // Importe as rotas de produto
import itemNfRoutes from "./routes/itemNfRoutes"; // Importe as rotas de itemNf

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "public")));

// Servir arquivos estáticos da pasta 'views'
app.use(express.static(path.join(__dirname, "views")));

// Rotas da API
app.use("/empresa", empresaRoutes);
app.use("/client", clientRoutes);
app.use("/notaFiscal", notaFiscalRoutes); // Use as rotas de nota fiscal
app.use("/produto", produtoRoutes); // Use as rotas de produto
app.use("/itemNf", itemNfRoutes); // Use as rotas de itemNf

// Rota para servir o arquivo index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Rota para servir o arquivo dashboard.html
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
