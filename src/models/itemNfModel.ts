import db from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface ItemNf extends RowDataPacket {
  idItemNF: number;
  NotaFiscal: number;
  Produto: number;
  valorItemNF: number;
  tipoQtdItemNF: string;
  qtdItemNF: number;
  impostosItemNF: number;
  valorTotItemNF: number;
}

export const getAllItensNf = async (): Promise<ItemNf[]> => {
  const query = "SELECT * FROM itemNf";
  const [results] = await db.query<ItemNf[]>(query);
  return results;
};

export const getItemNfById = async (id: number): Promise<ItemNf | null> => {
  const query = "SELECT * FROM itemNf WHERE idItemNF = ?";
  const [results] = await db.query<ItemNf[]>(query, [id]);
  return results[0] || null;
};

export const createItemNf = async (
  NotaFiscal: number,
  Produto: number,
  valorItemNF: number,
  tipoQtdItemNF: string,
  qtdItemNF: number,
  impostosItemNF: number,
  valorTotItemNF: number
): Promise<number> => {
  const query = `
    INSERT INTO itemNf (NotaFiscal, Produto, valorItemNF, tipoQtdItemNF, qtdItemNF, impostosItemNF, valorTotItemNF)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    NotaFiscal,
    Produto,
    valorItemNF,
    tipoQtdItemNF,
    qtdItemNF,
    impostosItemNF,
    valorTotItemNF,
  ]);
  return results.insertId;
};

export const updateItemNf = async (
  id: number,
  NotaFiscal: number,
  Produto: number,
  valorItemNF: number,
  tipoQtdItemNF: string,
  qtdItemNF: number,
  impostosItemNF: number,
  valorTotItemNF: number
): Promise<boolean> => {
  const query = `
    UPDATE itemNf
    SET NotaFiscal = ?, Produto = ?, valorItemNF = ?, tipoQtdItemNF = ?, qtdItemNF = ?, impostosItemNF = ?, valorTotItemNF = ?
    WHERE idItemNF = ?
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    NotaFiscal,
    Produto,
    valorItemNF,
    tipoQtdItemNF,
    qtdItemNF,
    impostosItemNF,
    valorTotItemNF,
    id,
  ]);
  return results.affectedRows > 0;
};

export const deleteItemNf = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM itemNf WHERE idItemNF = ?";
  const [results] = await db.query<ResultSetHeader>(query, [id]);
  return results.affectedRows > 0;
};
