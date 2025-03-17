import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST, // Usa "localhost" como fallback, caso não esteja definido
  user: process.env.DB_USER, // Usa "root" como fallback
  password: process.env.DB_PASSWORD, // A senha agora vem do arquivo .env
  database: process.env.DB_NAME, // Nome do banco de dados
});

// Teste de conexão
(async () => {
  try {
    const [rows] = await connection.query("SELECT 1 + 1 AS result");
    console.log("Conexão com o banco de dados estabelecida com sucesso:", rows);
  } catch (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  }
})();

export default connection;
