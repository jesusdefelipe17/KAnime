import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { servicioPelicula } from '../services/servicioPelicula';
import { NavController, ToastController } from '@ionic/angular';
import { AnimePerfilResponse } from '../interfaces/AnimePerfilResponse';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EpisodiosResponse } from '../interfaces/EpisodiosResponse';
import { VideoEpisodioResponse } from '../interfaces/VideoEpisodioResponse';
import { ModalController } from '@ionic/angular';
import { VideoModalPage } from '../video-modal/video-modal.page';
import { VideoPlayerPage } from '../video-player/video-player.page'; 
import { DatabaseService } from '../services/data-base.service';
import { AnimeResponse } from '../interfaces/AnimeResponse';

@Component({
  selector: 'app-anime-perfil',
  templateUrl: './anime-perfil.page.html',
  styleUrls: ['./anime-perfil.page.scss'],
})
export class AnimePerfilPage implements OnInit {

  id: string;
  cargarAnime: boolean = false;
  anime: AnimePerfilResponse;
  similares: AnimeResponse[] = []; // Lista para contenido similar
  episodios: EpisodiosResponse[] = []; // Lista de episodios paginados
  selectedTab: string = 'episodes'; // Pestaña por defecto
  paginaActual: number = 0; // Mantiene el número de la página actual para la paginación
  cargandoMasEpisodios: boolean = false; // Indica si se están cargando más episodios
  hayMasEpisodios: boolean = true; // Indica si hay más episodios para cargar

  addAnime: AnimePerfilResponse;
  username : string;
  favoritos: { idAnime: string }[] = []; // Cambiado para que sea un arreglo de objetos
  filledHearts: Set<string> = new Set(); // Para guardar los IDs de animes llenos
  @ViewChild('openToast', { static: false }) openToast: any;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioAnime: servicioPelicula,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private dbService: DatabaseService, 
    private toastController: ToastController
  ) { 

    this.dbService.favoritos$.subscribe(favoritos => {
      this.favoritos = favoritos; // Actualiza la lista de favoritos
    });
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.username = await this.dbService.getUser();
  
  if (this.username) {
    await this.dbService.loadUserAnimes(this.username); // Cargar favoritos
  }

  this.cargarAnimePerfil();
  }

  cargarAnimePerfil() {
    // Llamamos a los servicios para obtener la información inicial del anime
    this.servicioAnime.getAnimePerfil(this.id).pipe(
      switchMap(anime => {
        this.anime = anime;  // Guardamos la información del anime primero
        // Ahora que tenemos el anime y sus géneros, hacemos la llamada para obtener los animes por género
        return forkJoin({
          episodios: this.cargarEpisodios(this.paginaActual),  // Cargar los primeros episodios
          similares: this.servicioAnime.getAnimesByGenre(this.anime.generos).pipe(
            catchError(() => of([])) // Manejo de errores en caso de que falle la llamada
          )
        });
      })
    ).subscribe({
      next: ({ episodios, similares }) => {
        this.similares = similares;
        this.episodios = episodios;
        this.cargarAnime = true; // Marcamos como cargado
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cargarAnime = true; // Marcamos como cargado incluso en caso de error
      }
    });
    
    
  }

// Cargar episodios con paginación
cargarEpisodios(pagina: number) {
  this.cargandoMasEpisodios = true;  // Indicamos que estamos cargando episodios
  return this.servicioAnime.getEpisodiosAnime(this.id, pagina).pipe(
    catchError(() => of([])),  // Si hay un error, devolvemos un array vacío
    tap((episodios) => {
      this.cargandoMasEpisodios = false;  // Detenemos el indicador de carga

      // Si no hay episodios, deshabilitamos el scroll infinito
      if (episodios.length === 0) {
        this.hayMasEpisodios = false;
      }
    })
  );
}

// Función para cargar más episodios cuando el usuario llega al final de la página
cargarMasEpisodios(event: any) {
  // Si ya estamos cargando episodios o no hay más episodios, salimos
  if (this.cargandoMasEpisodios || !this.hayMasEpisodios) {
    event.target.complete();  // Detenemos el spinner si no hay más episodios
    return;
  }

  // Incrementamos el número de página
  this.paginaActual++;

  // Cargamos los nuevos episodios
  this.cargarEpisodios(this.paginaActual).subscribe((nuevosEpisodios: EpisodiosResponse[]) => {
    if (nuevosEpisodios.length > 0) {
      this.episodios = [...this.episodios, ...nuevosEpisodios];  // Añadimos los nuevos episodios
    }

    event.target.complete();  // Detenemos el scroll infinito
  });
}


  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  async openVideoModal(episodio: EpisodiosResponse) {
    // Verifica si videos está en formato de cadena (string) y conviértelo en JSON
    let videosDisponibles = [];
    try {
      if (typeof episodio.videos === 'string') {
        videosDisponibles = JSON.parse(episodio.videos); // Convierte el string a array de objetos
      } else {
        videosDisponibles = episodio.videos; // Ya es un array
      }
    } catch (error) {
      console.error('Error al convertir videos a JSON:', error);
      return;
    }
  
    // Filtra los videos que tengan el campo "code"
    const videosConCodigo = videosDisponibles.filter(video => video.code);
  
    if (videosConCodigo.length > 0) {
      const modal = await this.modalCtrl.create({
        component: VideoModalPage,
        componentProps: {
          videos: videosConCodigo
        }
      });
      await modal.present();
      const result = await modal.onDidDismiss();
      if (result && result.data && result.data.videoUrl) {
        const videoModal = await this.modalCtrl.create({
          component: VideoPlayerPage,
          componentProps: {
            videoUrl: result.data.videoUrl,
            cssClass: 'full-screen-modal'
          }
        });
        return await videoModal.present();
      }
    } else {
      console.error('No hay videos disponibles para este episodio.');
    }
  }

  isFavorito(animeId: string): boolean {
    return this.favoritos.some(fav => fav.idAnime === animeId);
  }
  
  async guardarAnime(idAnime: string) {
    if (!this.isFavorito(idAnime)) {
      const datosAnime = await this.servicioAnime.getAnimePerfil(idAnime).toPromise();
      
      if (this.username) {
        await this.dbService.addAnime(this.username, idAnime, datosAnime.titulo, datosAnime.calificacion, datosAnime.poster, false);
        
        this.presentToast('bottom','Añadido a favoritos','success');
        
        this.favoritos.push({ idAnime: idAnime });
        this.filledHearts.add(idAnime);
      }
    } else {
      this.presentToast('bottom','Ya está en favoritos','danger');
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom',message:string,color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color: color
    });

    await toast.present();
  }


}
