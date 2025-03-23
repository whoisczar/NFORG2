import * as notaFiscalModel from "../models/notaFiscalModel";
import { EmpresaModel } from "../models/empresaModel";
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
    const notasFiscais = await notaFiscalModel.getAllNotasFiscais(); // Verifique se essa função está implementada
    res.status(200).json(notasFiscais);
  } catch (err) {
    handleError(res, "Erro ao buscar notas fiscais", err);
  }
};
// Buscar nota por nome da empresa

export const searchNotaFiscalController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { empresa } = req.query; // Obtém o nome da empresa da query string

  if (!empresa || typeof empresa !== "string") {
    res.status(400).json({ message: "Nome da empresa é obrigatório" });
    return;
  }

  try {
    const notasFiscais = await notaFiscalModel.getNotasFiscaisByEmpresa(
      empresa
    );
    res.status(200).json(notasFiscais);
  } catch (err) {
    console.error("Erro ao buscar notas fiscais:", err);
    res.status(500).json({ message: "Erro ao buscar notas fiscais" });
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
    console.error("Erro ao buscar nota fiscal:", err);
    res.status(500).json({ message: "Erro ao buscar nota fiscal" });
  }
};

export const createNotaFiscalController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { idEmpresa, dataNotaFiscal, produtos } = req.body;

    // Buscar o CPF/CNPJ da empresa
    const empresa = await EmpresaModel.getById(Number(idEmpresa));
    if (!empresa) {
      res.status(404).json({ message: "Empresa não encontrada" });
      return; // Encerra a função após enviar a resposta
    }

    const cpf_cnpj = empresa.cnpjEmpresa; // ou `empresa.cpfEmpresa` se necessário

    // Criar a nota fiscal com o cpf_cnpj
    const idNotaFiscal = await notaFiscalModel.createNotaFiscal(
      cpf_cnpj, // Primeiro argumento: string
      dataNotaFiscal, // Segundo argumento: string
      produtos // Terceiro argumento: Array<{ idProduto: number; quantidade: number }>
    );

    res.status(201).json({ message: "Nota fiscal criada", idNotaFiscal });
  } catch (err) {
    handleError(res, "Erro ao criar nota fiscal", err);
  }
};
// Função auxiliar para calcular o valor total da nota fiscal
const calcularValorNota = (produtos: any[]): number => {
  return produtos.reduce(
    (total, produto) =>
      total + (produto.valorProduto * produto.quantidade || 0),
    0
  );
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
      // Verifique se essa função está implementada
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
    const success = await notaFiscalModel.deleteNotaFiscal(id); // Verifique se essa função está implementada
    if (success) {
      res.status(200).json({ message: "Nota fiscal deletada com sucesso" });
    } else {
      res.status(404).json({ message: "Nota fiscal não encontrada" });
    }
  } catch (err) {
    handleError(res, "Erro ao deletar nota fiscal", err);
  }
};
