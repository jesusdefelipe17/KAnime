import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db: SQLiteObject;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.platform.ready().then(() => {
      this.createDatabase();
    });
  }

  private async createDatabase() {
    this.db = await this.sqlite.create({
      name: 'anime.db',
      location: 'default'
    });
    await this.createTables();
  }

  private async createTables() {
    // Crea las tablas necesarias
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT
      )
    `, []);
    
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS animes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        userId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `, []);
  }

  // Métodos para manejar usuarios y animes
  async addUser(username: string) {
    const sql = 'INSERT INTO users (username) VALUES (?)';
    return await this.db.executeSql(sql, [username]);
  }

  async findUserByUsername(username: string): Promise<any | null> {
    const sql = 'SELECT * FROM usuarios WHERE username = ?';
    const res = await this.db.executeSql(sql, [username]);
    
    return res.rows.length > 0 ? res.rows.item(0) : null;  // Retorna el usuario si existe, de lo contrario null
  }

  async getUsers() {
    const sql = 'SELECT * FROM users';
    return await this.db.executeSql(sql, []).then(res => {
      const users = [];
      for (let i = 0; i < res.rows.length; i++) {
        users.push(res.rows.item(i));
      }
      return users;
    });
  }

  // Métodos para manejar animes
  async addAnime(title: string, userId: number) {
    const sql = 'INSERT INTO animes (title, userId) VALUES (?, ?)';
    return await this.db.executeSql(sql, [title, userId]);
  }

  async getAnimesByUser(userId: number) {
    const sql = 'SELECT * FROM animes WHERE userId = ?';
    return await this.db.executeSql(sql, [userId]).then(res => {
      const animes = [];
      for (let i = 0; i < res.rows.length; i++) {
        animes.push(res.rows.item(i));
      }
      return animes;
    });
  }
}