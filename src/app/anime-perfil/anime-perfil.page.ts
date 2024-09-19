import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { servicioPelicula } from '../services/servicioPelicula';
import { NavController } from '@ionic/angular';
import { AnimePerfilResponse } from '../interfaces/AnimePerfilResponse';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  errorHandler($event: ErrorEvent) {
    console.error('Image load error', $event);
  }
  id: string;
  cargarAnime: boolean = false;
  anime: AnimePerfilResponse;
  similares: AnimePerfilResponse[] = []; // Lista para contenido similar
  episodios: EpisodiosResponse[] = []; // Mocked episodes
  selectedTab: string = 'episodes'; // Default tab
  videosEnlaces: VideoEpisodioResponse[] = []; // Mocked episodes

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

    forkJoin({
      anime: this.servicioAnime.getAnimePerfil(this.id),
      episodios:this.servicioAnime.getEpisodiosAnime(this.id),
      //videosEnlaces:this.servicioAnime.getEpisodiosAnimeVideo(this.id),
      similares: this.servicioAnime.getContenidoSimilar(this.id).pipe(
        catchError(() => of([])) // Manejo de errores y retorno de array vacío si falla la llamada
      )
    }).subscribe({
      next: ({ anime, similares, episodios }) => {
        this.anime = anime;
        this.similares = similares; // Asignar el contenido similar
        this.cargarAnime = true;

        // Mocked episodes
        this.episodios = episodios;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.cargarAnime = true; // Asegúrate de manejar el estado en caso de error
      }
    });
  }

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  close() {
    this.router.navigate(['../']);
  }

  downloadEpisode(_t58: EpisodiosResponse) {
    throw new Error('Method not implemented.');
    }

    async openVideoModal(episodio: EpisodiosResponse) {
      // Filtra los videos disponibles con "code" relleno
      const videosDisponibles = episodio.videos.filter(video => video.code);
    
      if (videosDisponibles.length > 0) {
        // Abrimos el modal para seleccionar un servidor
        const modal = await this.modalCtrl.create({
          component: VideoModalPage,
          componentProps: {
            videos: videosDisponibles // Pasamos los videos disponibles al modal
          }
        });
    
        // Presentamos el modal
        await modal.present();
    
        // Esperamos a que el modal se cierre
        const result = await modal.onDidDismiss();
    
        // Si se seleccionó un video, abrimos el reproductor
        if (result && result.data && result.data.videoUrl) {
          const videoModal = await this.modalCtrl.create({
            component: VideoPlayerPage,
            componentProps: {
              videoUrl: result.data.videoUrl, // Pasamos la URL del video seleccionado al reproductor
              cssClass: 'full-screen-modal' // Añade una clase personalizada para estilos
            }
          });
    
          return await videoModal.present();
        }
      } else {
        console.error('No hay videos disponibles para este episodio.');
      }
    }
    
}
