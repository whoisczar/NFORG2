import { Request, Response } from "express";
import { HistoricoModel } from "../models/historicoModel";

// Função auxiliar para tratamento de erro
const handleError = (res: Response, message: string, error: any): void => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

// Buscar todos os históricos
export const getAllHistoricos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const historicos = await HistoricoModel.getAll();
    res.status(200).json(historicos);
  } catch (err) {
    handleError(res, "Erro ao buscar histórico", err);
  }
};

// Buscar histórico por ID
export const getHistoricoById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const historico = await HistoricoModel.getById(Number(req.params.id));
    if (historico) {
      res.status(200).json(historico);
    } else {
      res.status(404).json({ message: "Histórico não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao buscar histórico", err);
  }
};

// Criar histórico
export const createHistorico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { client, observacaoHistorico, dataHistorico } = req.body;
    const id = await HistoricoModel.create(
      client,
      observacaoHistorico,
      new Date(dataHistorico) // Garantir que a data seja convertida para o formato correto
    );
    res.status(201).json({ message: "Histórico criado", id });
  } catch (err) {
    handleError(res, "Erro ao criar histórico", err);
  }
};

// Atualizar histórico
export const updateHistorico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { client, observacaoHistorico, dataHistorico } = req.body;
    const updated = await HistoricoModel.update(
      Number(id),
      client,
      observacaoHistorico,
      new Date(dataHistorico) // Garantir que a data seja convertida corretamente
    );
    if (updated) {
      res.status(200).json({ message: "Histórico atualizado" });
    } else {
      res.status(404).json({ message: "Histórico não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao atualizar histórico", err);
  }
};

// Deletar histórico
export const deleteHistorico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await HistoricoModel.delete(Number(id));
    if (deleted) {
      res.status(200).json({ message: "Histórico removido" });
    } else {
      res.status(404).json({ message: "Histórico não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao remover histórico", err);
  }
};
