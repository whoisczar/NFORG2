import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "gerenciador",
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
