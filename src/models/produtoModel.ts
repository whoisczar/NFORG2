import db from "../database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Produto extends RowDataPacket {
  idProduto: number;
  nomeProduto: string;
  eanProduto: string;
  valorProduto: number;
}

interface ProdutoMaisVendido extends RowDataPacket {
  idProduto: number;
  nomeProduto: string;
  total_vendido: number;
}

// Função para buscar produtos mais vendidos
export const getProdutosMaisVendidos = async (): Promise<
  ProdutoMaisVendido[]
> => {
  const query = `
    SELECT 
      p.idProduto, 
      p.nomeProduto, 
      SUM(i.qtdItemNF) AS total_vendido
    FROM 
      produto p
    JOIN 
      itemNf i ON p.idProduto = i.Produto
    GROUP BY 
      p.idProduto, p.nomeProduto
    ORDER BY 
      total_vendido DESC;
  `;
  const [results] = await db.query<ProdutoMaisVendido[]>(query);
  return results;
};

export const searchProdutos = async (query: string): Promise<Produto[]> => {
  const searchQuery = `%${query}%`; // Adiciona wildcards para busca parcial
  const sql = `
    SELECT * FROM produto
    WHERE nomeProduto LIKE ?
  `;
  const [results] = await db.query<Produto[]>(sql, [searchQuery]);
  return results;
};

// Buscar todos os produtos
export const getAllProdutos = async (): Promise<Produto[]> => {
  const query = "SELECT * FROM produto";
  const [results] = await db.query<Produto[]>(query);
  return results;
};

// Buscar produto por ID
export const getProdutoById = async (id: number): Promise<Produto | null> => {
  const query = "SELECT * FROM produto WHERE idProduto = ?";
  const [results] = await db.query<Produto[]>(query, [id]);
  return results[0] || null;
};
// Criar um novo produto
export const createProduto = async (
  nomeProduto: string,
  eanProduto: string,
  valorProduto: number
): Promise<number> => {
  const query = `
    INSERT INTO produto (nomeProduto, eanProduto, valorProduto)
    VALUES (?, ?, ?)
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    nomeProduto,
    eanProduto,
    valorProduto,
  ]);
  return results.insertId;
};

// Atualizar um produto existente
export const updateProduto = async (
  id: number,
  nomeProduto: string,
  eanProduto: string,
  valorProduto: number
): Promise<boolean> => {
  const query = `
    UPDATE produto
    SET nomeProduto = ?, eanProduto = ?, valorProduto = ?
    WHERE idProduto = ?
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    nomeProduto,
    eanProduto,
    valorProduto,
    id,
  ]);
  return results.affectedRows > 0;
};

// Deletar um produto
export const deleteProduto = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM produto WHERE idProduto = ?";
  const [results] = await db.query<ResultSetHeader>(query, [id]);
  return results.affectedRows > 0;
};
