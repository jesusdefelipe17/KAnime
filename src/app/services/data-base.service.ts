import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {

  private storage: Storage;

  public animesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public animes$: Observable<any[]> = this.animesSubject.asObservable();

  private favoritosSubject = new BehaviorSubject<{ idAnime: string }[]>([]);
  public favoritos$ = this.favoritosSubject.asObservable();

  constructor(private sqlite: SQLite, private platform: Platform, private storageService: Storage) {
    this.platform.ready().then(() => {
    
       this.initStorage();  // Usar Storage en el navegador
      
    });
  }

 

  // Método para inicializar Ionic Storage en el navegador
  private async initStorage() {
    this.storage = await this.storageService.create();
  }


    
      // Método para agregar un anime a la base de datos
      async addAnime(username: string, idAnime: string, title: string, rating: string, poster: string, isManwha:boolean) {
        const animes = await this.storage.get('animes') || [];
        animes.push({ username, idAnime, title, rating, poster, isManwha });
        await this.storage.set('animes', animes);
        this.animesSubject.next(animes); // Actualizar el BehaviorSubject

        // Actualiza la lista de favoritos
        const favoritos = await this.getUserAnimes(username);
        this.favoritosSubject.next(favoritos); // Notificar sobre cambios en favoritos
      }

      async addManwha(username: string, idAnime: string, title: string, rating: string, poster: string) {
        const animes = await this.storage.get('animes') || [];
        animes.push({ username, idAnime, title, rating, poster });
        await this.storage.set('animes', animes);
        this.animesSubject.next(animes); // Actualizar el BehaviorSubject

        // Actualiza la lista de favoritos
        const favoritos = await this.getUserAnimes(username);
        this.favoritosSubject.next(favoritos); // Notificar sobre cambios en favoritos
      }

      async loadUserAnimes(username: string) {
        const animes = await this.getUserAnimes(username);
        this.favoritosSubject.next(animes); // Actualizar el BehaviorSubject de favoritos
    }
    
      // Método para obtener los animes de un usuario
      async getUserAnimes(username: string) {
          const animes = await this.storage.get('animes') || [];
          return animes.filter(anime => anime.username === username);
      }
    
      // Método para eliminar un anime
      async deleteAnime(animeId: string, username: string) {
        const animes = await this.storage.get('animes') || [];
        const updatedAnimes = animes.filter(anime => anime.idAnime !== animeId);
        await this.storage.set('animes', updatedAnimes);
        this.animesSubject.next(updatedAnimes); // Actualizar el BehaviorSubject
    
        // Actualiza la lista de favoritos
        await this.loadUserAnimes(username); // Recargar favoritos
      }
      async addUser(username: string) {
          const users = await this.storage.get('users') || [];
          users.push({ id: Date.now(), username });
          await this.storage.set('users', users);
        
      }

  async findUserByUsername(username: string): Promise<any | null> {
      const users = await this.storage.get('users') || [];
      return users.find(user => user.username === username) || null;
  }

  async getUsers() {
    return await this.storage.get('users') || [];
  }

  
  async getUser (){
    return await this.storage.get('user');
  }
}
