import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "gerenciador",
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
