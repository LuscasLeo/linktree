import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';

// Obter diretório do banco de dados da variável de ambiente ou usar o padrão
const dataDir = process.env.DB_DIRECTORY 
  ? path.resolve(process.env.DB_DIRECTORY)
  : path.join(__dirname, '../../data');

// Garantir que a pasta existe
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Caminho do banco de dados
const dbPath = path.join(dataDir, 'linktree.db');

// Inicialização do banco de dados
export async function initializeDatabase() {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Tabela de usuários para autenticação
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de links
  await db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      url TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Verificar se existe algum usuário, se não, criar um admin padrão
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
    console.log('Usuário admin criado com senha: admin123');
  }

  return db;
}

// Singleton para o banco de dados
let database: Database | null = null;

export async function getDatabase() {
  if (!database) {
    database = await initializeDatabase();
  }
  return database;
}
