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
  console.log("Executando consulta para CPF/CNPJ:", cpfCnpj);

  const [results] = await db.query<Client[]>(
    "SELECT * FROM client WHERE cpfCnpjClient = ?",
    [cpfCnpj]
  );

  console.log("Resultado da consulta no banco:", results);

  return results[0] || null;
};

//Create client
export const createClient = async (
  client: Omit<Client, "id">
): Promise<string> => {
  // Validação dos campos obrigatórios
  if (
    !client.cpfCnpjClient ||
    !client.nomeClient ||
    !client.emailClient ||
    !client.senhaClient ||
    !client.cargoClient ||
    !client.statusClient ||
    !client.empresa
  ) {
    throw new Error("Todos os campos do cliente são obrigatórios.");
  }

  const query = `
    INSERT INTO client (cpfCnpjClient, nomeClient, emailClient, senhaClient, cargoClient, statusClient, empresa)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    client.cpfCnpjClient,
    client.nomeClient,
    client.emailClient,
    client.senhaClient,
    client.cargoClient,
    client.statusClient,
    client.empresa,
  ];

  // Log para depuração
  console.log("Executando query:", query);
  console.log("Valores:", values);

  const [results] = await db.query<ResultSetHeader>(query, values);
  return client.cpfCnpjClient;
};

//Update Client
export const updateClient = async (
  cpfCnpjClient: string,
  clientData: Partial<Omit<Client, "cpfCnpjClient">>
): Promise<boolean> => {
  const query = `
    UPDATE client
    SET nomeClient = ?, emailClient = ?, 
        senhaClient = IFNULL(?, senhaClient),  -- Usando o valor atual caso senhaClient seja null
        cargoClient = ?, statusClient = ?, empresa = ?
    WHERE cpfCnpjClient = ?
  `;

  const values = [
    clientData.nomeClient,
    clientData.emailClient,
    clientData.senhaClient, // Se for null, o valor atual será mantido
    clientData.cargoClient,
    clientData.statusClient,
    clientData.empresa,
    cpfCnpjClient,
  ];

  // Log para depuração
  console.log("Consulta SQL:", query);
  console.log("Valores:", values);

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
