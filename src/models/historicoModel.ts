import { RowDataPacket, ResultSetHeader } from "mysql2";
import db from "../db";

export interface Historico extends RowDataPacket {
  idHistorico: number;
  client: string;
  observacaoHistorico: string;
  dataHistorico: Date;
}

export class HistoricoModel {
  static async getAll(): Promise<Historico[]> {
    const [results] = await db.query<Historico[]>("SELECT * FROM historico");
    return results;
  }

  static async getById(id: number): Promise<Historico | null> {
    const [results] = await db.query<Historico[]>(
      "SELECT * FROM historico WHERE idHistorico = ?",
      [id]
    );
    return results[0] || null;
  }

  static async create(
    client: string,
    observacaoHistorico: string,
    dataHistorico: Date
  ): Promise<number> {
    const [results] = await db.query<ResultSetHeader>(
      "INSERT INTO historico (client, observacaoHistorico, dataHistorico) VALUES (?, ?, ?)",
      [client, observacaoHistorico, dataHistorico]
    );
    return results.insertId;
  }

  static async update(
    id: number,
    client: string,
    observacaoHistorico: string,
    dataHistorico: Date
  ): Promise<boolean> {
    const [results] = await db.query<ResultSetHeader>(
      "UPDATE historico SET client = ?, observacaoHistorico = ?, dataHistorico = ? WHERE idHistorico = ?",
      [client, observacaoHistorico, dataHistorico, id]
    );
    return results.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [results] = await db.query<ResultSetHeader>(
      "DELETE FROM historico WHERE idHistorico = ?",
      [id]
    );
    return results.affectedRows > 0;
  }
}
