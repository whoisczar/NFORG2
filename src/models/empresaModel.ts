import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../database/db";

export interface Empresa extends RowDataPacket {
  idEmpresa: number;
  nomeEmpresa: string;
  cnpjEmpresa: string;
  statusEmpresa: number;
}

export class EmpresaModel {
  // Método para obter todas as empresas
  static async getAll(): Promise<Empresa[]> {
    const [results] = await db.query<Empresa[]>(
      "SELECT * FROM empresa ORDER BY nomeEmpresa ASC"
    );
    return results;
  }

  // Método para obter uma empresa pelo ID
  static async getById(id: number): Promise<Empresa | null> {
    const [results] = await db.query<Empresa[]>(
      "SELECT * FROM empresa WHERE idEmpresa = ?",
      [id]
    );
    return results[0] || null;
  }

  // Método para criar uma nova empresa com transação
  static async create({
    nomeEmpresa,
    cnpjEmpresa,
    statusEmpresa,
  }: Omit<Empresa, "idEmpresa">): Promise<number> {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const query =
        "INSERT INTO empresa (nomeEmpresa, cnpjEmpresa, statusEmpresa) VALUES (?, ?, ?)";
      const [results] = await connection.query<ResultSetHeader>(query, [
        nomeEmpresa,
        cnpjEmpresa,
        statusEmpresa,
      ]);

      const idEmpresa = results.insertId;

      await connection.commit();
      return idEmpresa;
    } catch (err) {
      await connection.rollback();
      console.error("Erro ao criar empresa:", err); // Melhor log de erro
      throw new Error("Falha ao criar empresa.");
    } finally {
      connection.release();
    }
  }

  // Método para atualizar uma empresa
  static async update(
    id: number,
    empresaData: Partial<Omit<Empresa, "idEmpresa">>
  ): Promise<boolean> {
    const queryParts = [];
    const values: any[] = [];

    for (const [key, value] of Object.entries(empresaData)) {
      queryParts.push(`${key} = ?`);
      values.push(value);
    }

    const query = `UPDATE empresa SET ${queryParts.join(
      ", "
    )} WHERE idEmpresa = ?`;
    values.push(id);

    const [results] = await db.query<ResultSetHeader>(query, values);
    return results.affectedRows > 0;
  }

  // Método para deletar uma empresa
  static async delete(id: number): Promise<boolean> {
    const [results] = await db.query<ResultSetHeader>(
      "DELETE FROM empresa WHERE idEmpresa = ?",
      [id]
    );
    return results.affectedRows > 0;
  }
}
