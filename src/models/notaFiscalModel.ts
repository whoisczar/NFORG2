import db from "../database/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface NotaFiscal extends RowDataPacket {
  idNotaFiscal: number;
  valorNotaFiscal: number;
  dataNotaFiscal: Date;
  dataNotaCadastrada: Date;
  cpf_cnpj: string;
  nomeClient: string;
  nomeEmpresa: string;
  produtos: Array<{
    nomeProduto: string;
    quantidade: number;
    valorProduto: number;
  }>;
}

export const getNotasFiscaisByEmpresa = async (
  nomeEmpresa: string
): Promise<NotaFiscal[]> => {
  const query = `
    SELECT 
      nf.idNotaFiscal, 
      nf.valorNotaFiscal, 
      nf.dataNotaFiscal, 
      nf.dataNotaCadastrada, 
      nf.cpf_cnpj, 
      c.nomeClient,
      e.nomeEmpresa
    FROM 
      notafiscal nf
    JOIN 
      client c ON nf.cpf_cnpj = c.cpfCnpjClient
    JOIN 
      empresa e ON c.empresa = e.idEmpresa
    WHERE 
      e.nomeEmpresa LIKE ?
  `;
  const [results] = await db.query<NotaFiscal[]>(query, [`%${nomeEmpresa}%`]);
  return results;
};

// Buscar todas as notas fiscais
export const getAllNotasFiscais = async (): Promise<NotaFiscal[]> => {
  const query = `
    SELECT nf.idNotaFiscal, nf.valorNotaFiscal, nf.dataNotaFiscal, nf.dataNotaCadastrada, nf.cpf_cnpj, c.nomeClient
    FROM notafiscal nf
    JOIN client c ON nf.cpf_cnpj = c.cpfCnpjClient
  `;
  const [results] = await db.query<NotaFiscal[]>(query);
  return results;
};
export const getNotaFiscalById = async (
  id: number
): Promise<NotaFiscal | null> => {
  const queryNotaFiscal = `
    SELECT 
      nf.idNotaFiscal, 
      nf.valorNotaFiscal, 
      nf.dataNotaFiscal, 
      nf.dataNotaCadastrada, 
      nf.cpf_cnpj, 
      c.nomeClient,
      e.nomeEmpresa
    FROM 
      notafiscal nf
    JOIN 
      client c ON nf.cpf_cnpj = c.cpfCnpjClient
    JOIN 
      empresa e ON c.empresa = e.idEmpresa
    WHERE 
      nf.idNotaFiscal = ?;
  `;
  const [notaFiscal] = await db.query<NotaFiscal[]>(queryNotaFiscal, [id]);

  if (notaFiscal.length === 0) {
    return null;
  }

  // Busca os produtos associados à nota fiscal
  const queryProdutos = `
    SELECT 
      p.nomeProduto, 
      i.qtdItemNF AS quantidade, 
      i.valorItemNF AS valorProduto
    FROM 
      itemNf i
    JOIN 
      produto p ON i.Produto = p.idProduto
    WHERE 
      i.NotaFiscal = ?;
  `;
  const [produtos] = await db.query<RowDataPacket[]>(queryProdutos, [id]);

  // Retorna o objeto completo da nota fiscal
  return {
    ...notaFiscal[0],
    produtos: produtos.map((produto) => ({
      nomeProduto: produto.nomeProduto,
      quantidade: produto.quantidade,
      valorProduto: produto.valorProduto,
    })),
  };
};
// Atualizar uma nota fiscal
export const updateNotaFiscal = async (
  id: number,
  valorNotaFiscal: number,
  dataNotaFiscal: Date,
  dataNotaCadastrada: Date,
  cpf_cnpj: string // Alterado para string
): Promise<boolean> => {
  const query = `
    UPDATE notafiscal
    SET valorNotaFiscal = ?, dataNotaFiscal = ?, dataNotaCadastrada = ?, cpf_cnpj = ?
    WHERE idNotaFiscal = ?
  `;
  const [results] = await db.query<ResultSetHeader>(query, [
    valorNotaFiscal,
    dataNotaFiscal,
    dataNotaCadastrada,
    cpf_cnpj,
    id,
  ]);
  return results.affectedRows > 0;
};

// Deletar uma nota fiscal
export const deleteNotaFiscal = async (id: number): Promise<boolean> => {
  const query = "DELETE FROM notafiscal WHERE idNotaFiscal = ?";
  const [results] = await db.query<ResultSetHeader>(query, [id]);
  return results.affectedRows > 0;
};

// Criar uma nota fiscal
export const createNotaFiscal = async (
  cpf_cnpj: string,
  dataNotaFiscal: string,
  produtos: Array<{ idProduto: number; quantidade: number }>
): Promise<number> => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // Coletar todos os preços dos produtos em uma única consulta
    const idsProdutos = produtos.map((p) => p.idProduto);
    const [produtosInfo] = await connection.query<RowDataPacket[]>(
      `SELECT idProduto, valorProduto FROM produto WHERE idProduto IN (?)`,
      [idsProdutos]
    );

    // Criar um mapa de idProduto para valorProduto
    const mapaProdutos = produtosInfo.reduce((acc, produto) => {
      acc[produto.idProduto] = produto.valorProduto;
      return acc;
    }, {} as Record<number, number>);

    // Calcular o valor total da nota fiscal
    let valorNotaFiscal = 0;
    for (const produto of produtos) {
      const valorItem = mapaProdutos[produto.idProduto];
      valorNotaFiscal += valorItem * produto.quantidade;
    }

    // Obter a data atual no formato YYYY-MM-DD
    const dataNotaCadastrada = new Date().toISOString().split("T")[0];

    // Inserir a nota fiscal
    const queryNotaFiscal = `
      INSERT INTO notafiscal (cpf_cnpj, dataNotaFiscal, valorNotaFiscal, dataNotaCadastrada)
      VALUES (?, ?, ?, ?)
    `;
    const [results] = await connection.query<ResultSetHeader>(queryNotaFiscal, [
      cpf_cnpj,
      dataNotaFiscal,
      valorNotaFiscal,
      dataNotaCadastrada, // Inserindo a data atual
    ]);
    const idNotaFiscal = results.insertId;

    // Inserir os itens da nota fiscal
    for (const produto of produtos) {
      const valorItemNF = mapaProdutos[produto.idProduto];
      const valorTotItemNF = valorItemNF * produto.quantidade;

      await connection.query<ResultSetHeader>(
        `INSERT INTO itemNf (NotaFiscal, Produto, valorItemNF, tipoQtdItemNF, qtdItemNF, impostosItemNF, valorTotItemNF)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          idNotaFiscal,
          produto.idProduto,
          valorItemNF,
          "UN", // Tipo de quantidade (unidade)
          produto.quantidade,
          0, // Impostos (ajuste necessário conforme o cálculo real)
          valorTotItemNF,
        ]
      );
    }

    // Commit da transação
    await connection.commit();
    return idNotaFiscal;
  } catch (err) {
    // Rollback em caso de erro
    await connection.rollback();
    throw err;
  } finally {
    // Liberar a conexão
    connection.release();
  }
};
