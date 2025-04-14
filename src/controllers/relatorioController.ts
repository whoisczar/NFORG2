import { Request, Response } from "express";
import * as relatorioModel from "../models/relatorioModel";

// Função auxiliar de erro reaproveitada
const handleError = (res: Response, message: string, error: any) => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

export const getClientsByCargoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await relatorioModel.getClientsByCargo();
    res.status(200).json(data);
  } catch (err) {
    handleError(res, "Erro ao gerar relatório de clientes por cargo", err);
  }
};

export const getClientsByEmpresaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await relatorioModel.getClientsByEmpresa();
    res.status(200).json(data);
  } catch (err) {
    handleError(res, "Erro ao gerar relatório de clientes por empresa", err);
  }
};

export const getClientsAtivosInativosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await relatorioModel.getClientsAtivosInativos();
    res.status(200).json(data);
  } catch (err) {
    handleError(
      res,
      "Erro ao gerar relatório de clientes ativos/inativos",
      err
    );
  }
};

export const getProdutosMaisVendidosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await relatorioModel.getProdutosMaisVendidos();
    res.status(200).json(data);
  } catch (err) {
    handleError(res, "Erro ao gerar relatório de produtos mais vendidos", err);
  }
};
