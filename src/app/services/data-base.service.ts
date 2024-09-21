import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db: SQLiteObject;
  private storage: Storage;
  private isNative: boolean = false;

  constructor(private sqlite: SQLite, private platform: Platform, private storageService: Storage) {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.isNative = true;
        this.createDatabase();  // Usar SQLite en dispositivos nativos
      } else {
        this.initStorage();  // Usar Storage en el navegador
      }
    });
  }

  // Método para inicializar SQLite
  private async createDatabase() {
    this.db = await this.sqlite.create({
      name: 'anime.db',
      location: 'default',
    });
    await this.createTables();
  }

  // Método para inicializar Ionic Storage en el navegador
  private async initStorage() {
    this.storage = await this.storageService.create();
  }

  private async createTables() {
    if (this.isNative) {
      await this.db.executeSql(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT
        )
      `, []);
          // Crear la tabla de animes relacionados con los usuarios
          await this.db.executeSql(`
            CREATE TABLE IF NOT EXISTS animes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT,
              idAnime TEXT,
              title TEXT,
              rating TEXT,
              poster TEXT,
              FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            )
          `, []);
        }
      }
    
      // Método para agregar un anime a la base de datos
      async addAnime(username: string, idAnime: string, title: string, rating: string, poster: string) {
        if (this.isNative) {
          const sql = 'INSERT INTO animes (username, idAnime, title, rating, poster) VALUES (?, ?, ?, ?, ?)';
          return await this.db.executeSql(sql, [username, idAnime, title, rating, poster]);
        } else {
          // Guardar en Storage (modo navegador)
          const animes = await this.storage.get('animes') || [];
          animes.push({ username, idAnime, title, rating, poster });
          await this.storage.set('animes', animes);
        }
      }
    
      // Método para obtener los animes de un usuario
      async getUserAnimes(username: string) {
        if (this.isNative) {
          const sql = 'SELECT * FROM animes WHERE username = ?';
          const res = await this.db.executeSql(sql, [username]);
          const animes = [];
          for (let i = 0; i < res.rows.length; i++) {
            animes.push(res.rows.item(i));
          }
          return animes;
        } else {
          const animes = await this.storage.get('animes') || [];
          return animes.filter(anime => anime.username === username);
        }
      }
    
      // Método para eliminar un anime
      async deleteAnime(animeId: string) {
        if (this.isNative) {
          const sql = 'DELETE FROM animes WHERE animeId = ?';
          return await this.db.executeSql(sql, [animeId]);
        } else {
          const animes = await this.storage.get('animes') || [];
          const updatedAnimes = animes.filter(anime => anime.idAnime !== animeId);
          await this.storage.set('animes', updatedAnimes);
        }
      }
  async addUser(username: string) {
    if (this.isNative) {
      const sql = 'INSERT INTO users (username) VALUES (?)';
      return await this.db.executeSql(sql, [username]);
    } else {
      const users = await this.storage.get('users') || [];
      users.push({ id: Date.now(), username });
      await this.storage.set('users', users);
    }
  }

  async findUserByUsername(username: string): Promise<any | null> {
    if (this.isNative) {
      const sql = 'SELECT * FROM users WHERE username = ?';
      const res = await this.db.executeSql(sql, [username]);
      return res.rows.length > 0 ? res.rows.item(0) : null;
    } else {
      const users = await this.storage.get('users') || [];
      return users.find(user => user.username === username) || null;
    }
  }

  async getUsers() {
    if (this.isNative) {
      const sql = 'SELECT * FROM users';
      return await this.db.executeSql(sql, []).then(res => {
        const users = [];
        for (let i = 0; i < res.rows.length; i++) {
          users.push(res.rows.item(i));
        }
        return users;
      });
    } else {
      return await this.storage.get('users') || [];
    }
  }

  
  async getUser (){

    return await this.storage.get('user');
 
  }
}
