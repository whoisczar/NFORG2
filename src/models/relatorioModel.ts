import db from "../database/db";
import { RowDataPacket } from "mysql2";

interface CargoReport extends RowDataPacket {
  cargoClient: string;
  total: number;
}

interface EmpresaReport extends RowDataPacket {
  nomeEmpresa: string;
  total: number;
}

interface AtivosInativosReport extends RowDataPacket {
  status: string;
  total: number;
}

interface ProdutoMaisVendidoReport extends RowDataPacket {
  nomeProduto: string;
  totalVendido: number;
}

export const getClientsByCargo = async (): Promise<CargoReport[]> => {
  const query = `
    SELECT cargoClient, COUNT(*) AS total
    FROM client
    GROUP BY cargoClient
  `;
  const [results] = await db.query<CargoReport[]>(query);
  return results;
};

export const getClientsByEmpresa = async (): Promise<EmpresaReport[]> => {
  const query = `
    SELECT e.nomeEmpresa, COUNT(*) AS total
    FROM client c
    JOIN empresa e ON c.empresa = e.idEmpresa
    GROUP BY e.nomeEmpresa
  `;
  const [results] = await db.query<EmpresaReport[]>(query);
  return results;
};

export const getClientsAtivosInativos = async (): Promise<
  AtivosInativosReport[]
> => {
  const query = `
    SELECT statusClient, COUNT(*) AS total
    FROM client
    GROUP BY statusClient
  `;
  const [results] = await db.query<AtivosInativosReport[]>(query);
  return results;
};

export const getProdutosMaisVendidos = async (): Promise<
  ProdutoMaisVendidoReport[]
> => {
  const query = `
      SELECT 
        p.nomeProduto, 
        SUM(i.qtdItemNF) AS totalVendido,
        SUM(i.qtdItemNF * p.valorProduto) AS valorTotalVendido
      FROM produto p
      JOIN itemNf i ON p.idProduto = i.Produto
      GROUP BY p.nomeProduto
    `;
  const [results] = await db.query<ProdutoMaisVendidoReport[]>(query);
  return results;
};
