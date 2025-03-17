import { Request, Response } from "express";
import * as ItemNfService from "../models/itemNfModel";

// Função auxiliar para tratamento de erro
const handleError = (res: Response, message: string, error: any): void => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

// Buscar todos os itens da nota fiscal
export const getAllItensNf = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const itensNf = await ItemNfService.getAllItensNf();
    res.status(200).json(itensNf);
  } catch (err) {
    handleError(res, "Erro ao buscar itens da nota fiscal", err);
  }
};

// Buscar item da nota fiscal por ID
export const getItemNfById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const itemNf = await ItemNfService.getItemNfById(Number(id));
    if (!itemNf) {
      res.status(404).json({ message: "Item da nota fiscal não encontrado" });
    } else {
      res.status(200).json(itemNf);
    }
  } catch (err) {
    handleError(res, "Erro ao buscar item da nota fiscal", err);
  }
};

// Criar um novo item da nota fiscal
export const createItemNf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    NotaFiscal,
    Produto,
    valorItemNF,
    tipoQtdItemNF,
    qtdItemNF,
    impostosItemNF,
    valorTotItemNF,
  } = req.body;

  try {
    const newItemId = await ItemNfService.createItemNf(
      NotaFiscal,
      Produto,
      valorItemNF,
      tipoQtdItemNF,
      qtdItemNF,
      impostosItemNF,
      valorTotItemNF
    );
    res
      .status(201)
      .json({ message: "Item da nota fiscal criado", id: newItemId });
  } catch (err) {
    handleError(res, "Erro ao criar item da nota fiscal", err);
  }
};

// Atualizar um item da nota fiscal
export const updateItemNf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    NotaFiscal,
    Produto,
    valorItemNF,
    tipoQtdItemNF,
    qtdItemNF,
    impostosItemNF,
    valorTotItemNF,
  } = req.body;

  try {
    const updated = await ItemNfService.updateItemNf(
      Number(id),
      NotaFiscal,
      Produto,
      valorItemNF,
      tipoQtdItemNF,
      qtdItemNF,
      impostosItemNF,
      valorTotItemNF
    );

    if (updated) {
      res
        .status(200)
        .json({ message: "Item da nota fiscal atualizado com sucesso" });
    } else {
      res.status(404).json({ message: "Item da nota fiscal não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao atualizar item da nota fiscal", err);
  }
};

// Deletar um item da nota fiscal
export const deleteItemNf = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const deleted = await ItemNfService.deleteItemNf(Number(id));
    if (deleted) {
      res
        .status(200)
        .json({ message: "Item da nota fiscal deletado com sucesso" });
    } else {
      res.status(404).json({ message: "Item da nota fiscal não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao deletar item da nota fiscal", err);
  }
};
