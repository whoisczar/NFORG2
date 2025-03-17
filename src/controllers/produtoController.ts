import { Request, Response } from "express";
import * as ProdutoService from "../models/produtoModel";

// Função auxiliar para tratamento de erro
const handleError = (res: Response, message: string, error: any): void => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

// Buscar todos os produtos
export const getAllProdutosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const produtos = await ProdutoService.getAllProdutos();
    res.status(200).json(produtos);
  } catch (err) {
    handleError(res, "Erro ao buscar produtos", err);
  }
};

// Buscar produto por ID
export const getProdutoByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const produto = await ProdutoService.getProdutoById(id);
    if (!produto) {
      res.status(404).json({ message: "Produto não encontrado" });
    } else {
      res.status(200).json(produto);
    }
  } catch (err) {
    handleError(res, "Erro ao buscar produto", err);
  }
};

// Criar um novo produto
export const createProdutoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { nomeProduto, eanProduto, valorProduto } = req.body;
  try {
    const id = await ProdutoService.createProduto(
      nomeProduto,
      eanProduto,
      valorProduto
    );
    res.status(201).json({ id });
  } catch (err) {
    handleError(res, "Erro ao criar produto", err);
  }
};

// Atualizar um produto existente
export const updateProdutoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  const { nomeProduto, eanProduto, valorProduto } = req.body;
  try {
    const success = await ProdutoService.updateProduto(
      id,
      nomeProduto,
      eanProduto,
      valorProduto
    );
    if (success) {
      res.status(200).json({ message: "Produto atualizado com sucesso" });
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao atualizar produto", err);
  }
};

// Deletar um produto
export const deleteProdutoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = parseInt(req.params.id);
  try {
    const success = await ProdutoService.deleteProduto(id);
    if (success) {
      res.status(200).json({ message: "Produto deletado com sucesso" });
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao deletar produto", err);
  }
};
