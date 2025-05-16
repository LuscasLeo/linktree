import { getDatabase } from '../config/database';
import { Link } from './types';

export class LinkModel {
  /**
   * Busca todos os links ativos
   */
  static async getAllActive(): Promise<Link[]> {
    const db = await getDatabase();
    return await db.all(
      `SELECT * FROM links WHERE active = 1 ORDER BY order_index ASC, created_at DESC`
    );
  }

  /**
   * Busca todos os links (para o painel admin)
   */
  static async getAll(): Promise<Link[]> {
    const db = await getDatabase();
    return await db.all(
      `SELECT * FROM links ORDER BY order_index ASC, created_at DESC`
    );
  }

  /**
   * Busca um link pelo ID
   */
  static async getById(id: number): Promise<Link | undefined> {
    const db = await getDatabase();
    return await db.get(`SELECT * FROM links WHERE id = ?`, [id]);
  }

  /**
   * Cria um novo link
   */
  static async create(link: Link): Promise<number> {
    const db = await getDatabase();
    const result = await db.run(
      `INSERT INTO links (title, url, order_index, active) VALUES (?, ?, ?, ?)`,
      [link.title, link.url, link.order_index, link.active ? 1 : 0]
    );
    
    return result.lastID || 0;
  }

  /**
   * Atualiza um link existente
   */
  static async update(id: number, link: Link): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run(
      `UPDATE links 
       SET title = ?, url = ?, order_index = ?, active = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [link.title, link.url, link.order_index, link.active ? 1 : 0, id]
    );
    
    return (result.changes ?? 0) > 0;
  }

  /**
   * Exclui um link
   */
  static async delete(id: number): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.run(`DELETE FROM links WHERE id = ?`, [id]);
    
    return (result.changes ?? 0) > 0;
  }

  /**
   * Atualiza a ordem dos links
   */
  static async updateOrder(linkIds: number[]): Promise<boolean> {
    const db = await getDatabase();
    
    try {
      await db.run('BEGIN TRANSACTION');
      
      for (let i = 0; i < linkIds.length; i++) {
        await db.run(
          'UPDATE links SET order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [i, linkIds[i]]
        );
      }
      
      await db.run('COMMIT');
      return true;
    } catch (error) {
      await db.run('ROLLBACK');
      console.error('Erro ao atualizar ordem dos links:', error);
      return false;
    }
  }
}
