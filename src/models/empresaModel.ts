import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../db";

export interface Empresa extends RowDataPacket {
  idEmpresa: number;
  nomeEmpresa: string;
  cnpjEmpresa: string;
  statusEmpresa: number;
}

export class EmpresaModel {
  static async getAll(): Promise<Empresa[]> {
    const [results] = await db.query<Empresa[]>("SELECT * FROM empresa");
    return results;
  }

  static async getById(id: number): Promise<Empresa | null> {
    const [results] = await db.query<Empresa[]>(
      "SELECT * FROM empresa WHERE idEmpresa = ?",
      [id]
    );
    return results[0] || null;
  }

  static async create({
    nomeEmpresa,
    cnpjEmpresa,
    statusEmpresa,
  }: Omit<Empresa, "idEmpresa">): Promise<number> {
    const query =
      "INSERT INTO empresa (nomeEmpresa, cnpjEmpresa, statusEmpresa) VALUES (?, ?, ?)";
    const [results] = await db.query<ResultSetHeader>(query, [
      nomeEmpresa,
      cnpjEmpresa,
      statusEmpresa,
    ]);
    return results.insertId;
  }

  static async update(
    id: number,
    empresaData: Partial<Omit<Empresa, "idEmpresa">>
  ): Promise<boolean> {
    const query =
      "UPDATE empresa SET nomeEmpresa = ?, cnpjEmpresa = ?, statusEmpresa = ? WHERE idEmpresa = ?";
    const values = [...Object.values(empresaData), id];
    const [results] = await db.query<ResultSetHeader>(query, values);
    return results.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [results] = await db.query<ResultSetHeader>(
      "DELETE FROM empresa WHERE idEmpresa = ?",
      [id]
    );
    return results.affectedRows > 0;
  }
}
