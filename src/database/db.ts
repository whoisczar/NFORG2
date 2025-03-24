import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const connection = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'gerenciador',
  port: 3306
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
