import db from "../database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Client extends RowDataPacket {
  cpfCnpjClient: string;
  nomeClient: string;
  emailClient: string;
  senhaClient: string;
  cargoClient: string;
  statusClient: number;
  empresa: number;
}

export const getAllClients = async (): Promise<Client[]> => {
  const [results] = await db.query<Client[]>("SELECT * FROM client");
  return results;
};

export const getClientByCpfCnpjAndPassword = async (
  cpfCnpj: string,
  senha: string
): Promise<Client | null> => {
  const [results] = await db.query<Client[]>(
    "SELECT * FROM client WHERE cpfCnpjClient = ? AND senhaClient = ?",
    [cpfCnpj, senha]
  );
  return results[0] || null;
};

export const getClientByCpfCnpj = async (
  cpfCnpj: string
): Promise<Client | null> => {
  const [results] = await db.query<Client[]>(
    "SELECT * FROM client WHERE cpfCnpjClient = ?",
    [cpfCnpj]
  );
  return results[0] || null;
};

export const createClient = async (
  client: Omit<Client, "id">
): Promise<string> => {
  const query = `
    INSERT INTO client (cpfCnpjClient, nomeClient, emailClient, senhaClient, cargoClient, statusClient, empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await db.query<ResultSetHeader>(query, Object.values(client));
  return client.cpfCnpjClient;
};

export const updateClient = async (
  cpfCnpjClient: string,
  clientData: Partial<Omit<Client, "cpfCnpjClient">>
): Promise<boolean> => {
  const query = `
    UPDATE client
    SET nomeClient = ?, emailClient = ?, senhaClient = ?, cargoClient = ?, statusClient = ?, empresa = ?
    WHERE cpfCnpjClient = ?
  `;
  const values = [...Object.values(clientData), cpfCnpjClient];
  const [results] = await db.query<ResultSetHeader>(query, values);
  return results.affectedRows > 0;
};

export const deleteClient = async (cpfCnpjClient: string): Promise<boolean> => {
  const [results] = await db.query<ResultSetHeader>(
    "DELETE FROM client WHERE cpfCnpjClient = ?",
    [cpfCnpjClient]
  );
  return results.affectedRows > 0;
};
