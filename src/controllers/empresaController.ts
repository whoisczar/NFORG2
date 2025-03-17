import { Request, Response } from "express";
import { EmpresaModel } from "../models/empresaModel";

// Função auxiliar para lidar com erros
const handleError = (res: Response, message: string, error: any) => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

// Buscar todas as empresas
export const getAllEmpresas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const empresas = await EmpresaModel.getAll();
    res.status(200).json(empresas);
  } catch (err) {
    handleError(res, "Erro ao buscar empresas", err);
  }
};

// Buscar empresa por ID
export const getEmpresaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const empresa = await EmpresaModel.getById(Number(req.params.id));
    empresa
      ? res.status(200).json(empresa)
      : res.status(404).json({ message: "Empresa não encontrada" });
  } catch (err) {
    handleError(res, "Erro ao buscar empresa", err);
  }
};

// Criar empresa
export const createEmpresa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = await EmpresaModel.create(req.body);
    res.status(201).json({ message: "Empresa criada", id });
  } catch (err) {
    handleError(res, "Erro ao criar empresa", err);
  }
};

// Atualizar empresa
export const updateEmpresa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await EmpresaModel.update(Number(req.params.id), req.body);
    updated
      ? res.status(200).json({ message: "Empresa atualizada" })
      : res.status(404).json({ message: "Empresa não encontrada" });
  } catch (err) {
    handleError(res, "Erro ao atualizar empresa", err);
  }
};

// Deletar empresa
export const deleteEmpresa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await EmpresaModel.delete(Number(req.params.id));
    deleted
      ? res.status(200).json({ message: "Empresa removida" })
      : res.status(404).json({ message: "Empresa não encontrada" });
  } catch (err) {
    handleError(res, "Erro ao remover empresa", err);
  }
};
