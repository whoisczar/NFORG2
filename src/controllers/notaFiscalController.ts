import * as notaFiscalModel from "../models/notaFiscalModel";
import { Request, Response } from "express";

// Função auxiliar para tratamento de erro
const handleError = (res: Response, message: string, error: any): void => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

// Buscar todas as notas fiscais
export const getAllNotasFiscaisController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notasFiscais = await notaFiscalModel.getAllNotasFiscais();
    res.status(200).json(notasFiscais);
  } catch (err) {
    handleError(res, "Erro ao buscar notas fiscais", err);
  }
};

// Buscar nota fiscal por ID
export const getNotaFiscalByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const notaFiscal = await notaFiscalModel.getNotaFiscalById(id);
    if (!notaFiscal) {
      res.status(404).json({ message: "Nota fiscal não encontrada" });
    } else {
      res.status(200).json(notaFiscal);
    }
  } catch (err) {
    handleError(res, "Erro ao buscar nota fiscal", err);
  }
};

// Criar uma nova nota fiscal
export const createNotaFiscalController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj } =
    req.body;
  try {
    const id = await notaFiscalModel.createNotaFiscal(
      valorNotaFiscal,
      dataNotaFiscal,
      dataNotaCadastrada,
      cpf_cnpj
    );
    res.status(201).json({ id });
  } catch (err) {
    handleError(res, "Erro ao criar nota fiscal", err);
  }
};

// Atualizar uma nota fiscal
export const updateNotaFiscalController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { valorNotaFiscal, dataNotaFiscal, dataNotaCadastrada, cpf_cnpj } =
    req.body;
  try {
    const success = await notaFiscalModel.updateNotaFiscal(
      id,
      valorNotaFiscal,
      dataNotaFiscal,
      dataNotaCadastrada,
      cpf_cnpj
    );
    if (success) {
      res.status(200).json({ message: "Nota fiscal atualizada com sucesso" });
    } else {
      res.status(404).json({ message: "Nota fiscal não encontrada" });
    }
  } catch (err) {
    handleError(res, "Erro ao atualizar nota fiscal", err);
  }
};

// Deletar uma nota fiscal
export const deleteNotaFiscalController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const success = await notaFiscalModel.deleteNotaFiscal(id);
    if (success) {
      res.status(200).json({ message: "Nota fiscal deletada com sucesso" });
    } else {
      res.status(404).json({ message: "Nota fiscal não encontrada" });
    }
  } catch (err) {
    handleError(res, "Erro ao deletar nota fiscal", err);
  }
};
