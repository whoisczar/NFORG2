import { Request, Response } from "express";
import * as produtoModel from "../models/produtoModel";

// Função auxiliar para tratamento de erro
const handleError = (res: Response, message: string, error: any): void => {
  console.error(message, error);
  res.status(500).json({ message, error });
};

export const getProdutosMaisVendidosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Buscando produtos mais vendidos..."); // Log para depuração
    const produtos = await produtoModel.getProdutosMaisVendidos();
    console.log("Produtos mais vendidos encontrados:", produtos); // Log para depuração
    res.status(200).json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos mais vendidos:", err); // Log para depuração
    handleError(res, "Erro ao buscar produtos mais vendidos", err);
  }
};

export const searchProdutosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.query.q as string; // Obtém o parâmetro de consulta "q"
  if (!query) {
    res.status(400).json({ message: "Parâmetro de busca 'q' é obrigatório" });
    return;
  }

  try {
    const produtos = await produtoModel.searchProdutos(query);
    res.status(200).json(produtos);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar produtos", error: err });
  }
};

// Buscar todos os produtos
export const getAllProdutosController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const produtos = await produtoModel.getAllProdutos();
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

  // Validação do ID
  if (isNaN(id)) {
    res.status(400).json({ message: "ID do produto inválido" });
    return;
  }

  try {
    const produto = await produtoModel.getProdutoById(id);
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
    const id = await produtoModel.createProduto(
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
    const success = await produtoModel.updateProduto(
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
    const success = await produtoModel.deleteProduto(id);
    if (success) {
      res.status(200).json({ message: "Produto deletado com sucesso" });
    } else {
      res.status(404).json({ message: "Produto não encontrado" });
    }
  } catch (err) {
    handleError(res, "Erro ao deletar produto", err);
  }
};
