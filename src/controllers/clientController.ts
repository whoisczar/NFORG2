import { Request, Response } from "express";
import * as clientService from "../models/clientModel";

// Função auxiliar para lidar com erros
const handleError = (res: Response, message: string, error: any) => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

// Buscar todos os clientes
export const getAllClientsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await clientService.getAllClients();
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
    const client = await clientService.getClientByCpfCnpj(req.params.cpfCnpj);
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
    const cpfCnpj = await clientService.createClient(req.body);
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
    const success = await clientService.updateClient(
      req.params.cpfCnpj,
      req.body
    );
    success
      ? res.status(200).json({ message: "Cliente atualizado com sucesso" })
      : res.status(404).json({ message: "Cliente não encontrado" });
  } catch (err) {
    handleError(res, "Erro ao atualizar cliente", err);
  }
};

// Deletar cliente
export const deleteClientController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const success = await clientService.deleteClient(req.params.cpfCnpj);
    success
      ? res.status(200).json({ message: "Cliente deletado com sucesso" })
      : res.status(404).json({ message: "Cliente não encontrado" });
  } catch (err) {
    handleError(res, "Erro ao deletar cliente", err);
  }
};
