import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class EpisodiosService {
  private episodiosLeidos = new BehaviorSubject<Set<string>>(new Set());

  // Observable que pueden suscribirse los componentes
  episodiosLeidos$ = this.episodiosLeidos.asObservable();

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el servicio recuperando episodios leídos desde Storage
  private async init() {
    const episodios = await this.storage.get('episodiosLeidos') || [];
    this.episodiosLeidos.next(new Set(episodios));
  }

  // Marcar un episodio como leído
  async marcarComoLeido(episodioId: string) {
    const episodios = this.episodiosLeidos.value;
    episodios.add(episodioId);
    this.episodiosLeidos.next(new Set(episodios)); // Actualizamos el BehaviorSubject

    // Guardamos el estado en Storage
    await this.storage.set('episodiosLeidos', Array.from(episodios));
  }

  // Método para comprobar si el episodio ya ha sido leído
  esEpisodioLeido(episodioId: string): boolean {
    return this.episodiosLeidos.value.has(episodioId);
  }

  // Método para marcar todos los episodios como no leídos
  async resetEpisodiosLeidos() {
    this.episodiosLeidos.next(new Set());
    await this.storage.set('episodiosLeidos', []);
  }
}
