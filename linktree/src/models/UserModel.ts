import { getDatabase } from '../config/database';
import { User } from './types';
import bcrypt from 'bcrypt';

export class UserModel {
  /**
   * Busca um usuário pelo nome de usuário
   */
  static async getByUsername(username: string): Promise<User | undefined> {
    const db = await getDatabase();
    return await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
  }

  /**
   * Busca um usuário pelo ID
   */
  static async getById(id: number): Promise<User | undefined> {
    const db = await getDatabase();
    return await db.get(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  /**
   * Verifica se as credenciais do usuário são válidas
   */
  static async validateCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.getByUsername(username);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    return isValid ? user : null;
  }

  /**
   * Atualiza a senha de um usuário
   */
  static async updatePassword(id: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const db = await getDatabase();
    const result = await db.run(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, id]
    );
    
    return (result.changes ?? 0) > 0;
  }
}
