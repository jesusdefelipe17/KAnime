import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { servicioPelicula } from '../services/servicioPelicula';
import { NavController } from '@ionic/angular';
import { AnimePerfilResponse } from '../interfaces/AnimePerfilResponse';
import { forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EpisodiosResponse } from '../interfaces/EpisodiosResponse';
import { VideoEpisodioResponse } from '../interfaces/VideoEpisodioResponse';
import { ModalController } from '@ionic/angular';
import { VideoModalPage } from '../video-modal/video-modal.page';
import { VideoPlayerPage } from '../video-player/video-player.page'; 

@Component({
  selector: 'app-anime-perfil',
  templateUrl: './anime-perfil.page.html',
  styleUrls: ['./anime-perfil.page.scss'],
})
export class AnimePerfilPage implements OnInit {

  id: string;
  cargarAnime: boolean = false;
  anime: AnimePerfilResponse;
  similares: AnimePerfilResponse[] = []; // Lista para contenido similar
  episodios: EpisodiosResponse[] = []; // Lista de episodios paginados
  selectedTab: string = 'episodes'; // Pestaña por defecto
  paginaActual: number = 0; // Mantiene el número de la página actual para la paginación
  cargandoMasEpisodios: boolean = false; // Indica si se están cargando más episodios
  hayMasEpisodios: boolean = true; // Indica si hay más episodios para cargar

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioAnime: servicioPelicula,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.cargarAnimePerfil();
  }

  cargarAnimePerfil() {
    // Llamamos a los servicios para obtener la información inicial del anime
    forkJoin({
      anime: this.servicioAnime.getAnimePerfil(this.id),
      episodios: this.cargarEpisodios(this.paginaActual), // Cargar los primeros episodios
      similares: this.servicioAnime.getContenidoSimilar(this.id).pipe(
        catchError(() => of([])) // Manejo de errores y retorno de array vacío si falla la llamada
      )
    }).subscribe({
      next: ({ anime, episodios, similares }) => {
        this.anime = anime;
        this.similares = similares;
        this.episodios = episodios;
        this.cargarAnime = true;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cargarAnime = true; // Manejo de error
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
    const videosDisponibles = episodio.videos.filter(video => video.code);
    if (videosDisponibles.length > 0) {
      const modal = await this.modalCtrl.create({
        component: VideoModalPage,
        componentProps: {
          videos: videosDisponibles
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
}
