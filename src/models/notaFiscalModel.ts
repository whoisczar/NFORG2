import db from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface NotaFiscal extends RowDataPacket {
  idNotaFiscal: number;
  valorNotaFiscal: number;
  dataNotaFiscal: Date;
  dataNotaCadastrada: Date;
  cpf_cnpj: string;
  nomeClient: string;
}

// Buscar todas as notas fiscais
export const getAllNotasFiscais = async (): Promise<NotaFiscal[]> => {
  const query = `
    SELECT nf.idNotaFiscal, nf.valorNotaFiscal, nf.dataNotaFiscal, nf.dataNotaCadastrada, nf.cpf_cnpj, c.nomeClient
    FROM notafiscal nf
    JOIN client c ON nf.cpf_cnpj = c.cpfCnpjClient
  `;
  const [results] = await db.query<NotaFiscal[]>(query);
  return results;
};

// Buscar nota fiscal por ID
export const getNotaFiscalById = async (
  id: number
): Promise<NotaFiscal | null> => {
  const query = `
    SELECT nf.idNotaFiscal, nf.valorNotaFiscal, nf.dataNotaFiscal, nf.dataNotaCadastrada, nf.cpf_cnpj, c.nomeClient
    FROM notafiscal nf
    JOIN client c ON nf.cpf_cnpj = c.cpfCnpjClient
    WHERE nf.idNotaFiscal = ?
  `;
  const [results] = await db.query<NotaFiscal[]>(query, [id]);
  return results[0] || null;
};

// Criar uma nova nota fiscal
export const createNotaFiscal = async (
  valorNotaFiscal: number,
  dataNotaFiscal: Date,
  dataNotaCadastrada: Date,
  cpf_cnpj: string
): Promise<number> => {
  const query = `
    INSERT INTO notafiscal (valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj)
    VALUES (?, ?, ?, ?)
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    valorNotaFiscal,
    dataNotaFiscal,
    dataNotaCadastrada,
    cpf_cnpj,
  ]);
  return results.insertId;
};

// Atualizar uma nota fiscal
export const updateNotaFiscal = async (
  id: number,
  valorNotaFiscal: number,
  dataNotaFiscal: Date,
  dataNotaCadastrada: Date,
  cpf_cnpj: string
): Promise<boolean> => {
  const query = `
    UPDATE notafiscal
    SET valorNotaFiscal = ?, dataNotaFiscal = ?, dataNotaCadastrada = ?, cpf_cnpj = ?
    WHERE idNotaFiscal = ?
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    valorNotaFiscal,
    dataNotaFiscal,
    dataNotaCadastrada,
    cpf_cnpj,
    id,
  ]);
  return results.affectedRows > 0;
};

// Deletar uma nota fiscal
export const deleteNotaFiscal = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM notafiscal WHERE idNotaFiscal = ?";
  const [results] = await db.query<ResultSetHeader>(query, [id]);
  return results.affectedRows > 0;
};
