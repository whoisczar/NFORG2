import { Request, Response } from "express";
import * as clientModel from "../models/clientModel";

// Função auxiliar para lidar com erros
const handleError = (res: Response, message: string, error: any) => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

export const cargoVerificationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cpfCnpjClient, senhaClient } = req.body;

  // Verifica se os campos foram fornecidos
  if (!cpfCnpjClient || !senhaClient) {
    res.status(400).json({ message: "CPF/CNPJ e senha são obrigatórios" });
    return;
  }

  try {
    // Busca o usuário no banco de dados
    const client = await clientModel.getClientByCpfCnpjAndPassword(
      cpfCnpjClient,
      senhaClient
    );

    if (client) {
      // Verifica se o cargo é "Admin" ou "Gerente"
      if (
        client.cargoClient === "admin" ||
        client.cargoClient === "Gerente" ||
        client.cargoClient === "Diretora"
      ) {
        res.status(200).json({
          message: "Login bem-sucedido",
          isSuperUser: true, // Indica que o cargo é válido
        });
      } else {
        res.status(403).json({
          message: "Acesso negado. Cargo não autorizado.",
          isSuperUser: false, // Indica que o cargo não é válido
        });
      }
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  } catch (err) {
    handleError(res, "Erro ao processar login", err);
  }
};

export const loginClientController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cpfCnpjClient, senhaClient } = req.body;

  if (!cpfCnpjClient || !senhaClient) {
    res.status(400).json({ message: "CPF/CNPJ e senha são obrigatórios" });
    return;
  }

  try {
    const client = await clientModel.getClientByCpfCnpjAndPassword(
      cpfCnpjClient,
      senhaClient
    );

    if (client) {
      res.status(200).json({ message: "Login bem-sucedido" });
    } else {
      res.status(401).json({ message: "Credenciais inválidas" });
    }
  } catch (err) {
    handleError(res, "Erro ao processar login", err);
  }
};

// Buscar todos os clientes
export const getAllClientsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await clientModel.getAllClients();
    res.status(200).json(clients);
  } catch (err) {
    handleError(res, "Erro ao buscar clientes", err);
  }
};

// Buscar cliente por CPF/CNPJ
export const getClientByCpfCnpjController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("CPF/CNPJ recebido na rota:", req.params.cpfCnpj); // Log para verificar entrada

    const client = await clientModel.getClientByCpfCnpj(req.params.cpfCnpj);

    console.log("Resultado da consulta:", client); // Log para verificar retorno do banco

    client
      ? res.status(200).json(client)
      : res.status(404).json({ message: "Cliente não encontrado" });
  } catch (err) {
    handleError(res, "Erro ao buscar cliente", err);
  }
};

// Criar cliente
export const createClientController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cpfCnpj = await clientModel.createClient(req.body);
    res.status(201).json({ cpfCnpj });
  } catch (err) {
    handleError(res, "Erro ao criar cliente", err);
  }
};

// Atualizar cliente
export const updateClientController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Dados recebidos:", req.body); // Log dos dados recebidos
    const success = await clientModel.updateClient(
      req.params.cpfCnpj,
      req.body
    );
    success
      ? res.status(200).json({ message: "Cliente atualizado com sucesso" })
      : res.status(404).json({ message: "Cliente não encontrado" });
  } catch (err) {
    console.error("Erro ao atualizar cliente:", err); // Log de erro
    handleError(res, "Erro ao atualizar cliente", err);
  }
};

// Deletar cliente
export const deleteClientController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const success = await clientModel.deleteClient(req.params.cpfCnpj);
    success
      ? res.status(200).json({ message: "Cliente deletado com sucesso" })
      : res.status(404).json({ message: "Cliente não encontrado" });
  } catch (err) {
    handleError(res, "Erro ao deletar cliente", err);
  }
};
