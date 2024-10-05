import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { servicioManga } from '../services/servicioManga';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/data-base.service';
import { MangaPerfilResponse } from '../interfaces/MangaPerfilResponse';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manga-perfil',
  templateUrl: './manga-perfil.page.html',
  styleUrls: ['./manga-perfil.page.scss'],
})
export class MangaPerfilPage implements OnInit {

  id: string;
  cargarManga: boolean = false;
  manga: MangaPerfilResponse;
  selectedTab: string = 'episodes'; // Pestaña por defecto
  paginaActual: number = 0; // Mantiene el número de la página actual para la paginación
  cargandoMasEpisodios: boolean = false; // Indica si se están cargando más episodios
  hayMasEpisodios: boolean = true; // Indica si hay más episodios para cargar

  username : string;
  favoritos: { idAnime: string }[] = []; // Cambiado para que sea un arreglo de objetos
  filledHearts: Set<string> = new Set(); // Para guardar los IDs de animes llenos
  @ViewChild('openToast', { static: false }) openToast: any;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioManga: servicioManga,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private dbService: DatabaseService, 
    private toastController: ToastController
  ) { 

   
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
  
    /*
  if (this.username) {
    await this.dbService.loadUserAnimes(this.username); // Cargar favoritos
  }
    */

  this.cargarMangaPerfil();
  }

  cargarMangaPerfil() {
    this.cargarManga=true;
    this.servicioManga.getMangaPerfil(this.id).subscribe({
      next: (manga) => {
        this.manga = manga; // Si la llamada es exitosa, asigna el manga  
        this.cargarManga=true;
      },
      error: (err) => {
        console.error('Error al cargar el manga:', err); // Manejo del error
        this.cargarManga=false;
      }
    });
  }
  

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  /*
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
        await this.dbService.addAnime(this.username, idAnime, datosAnime.titulo, datosAnime.calificacion, datosAnime.poster);
        
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

  */

}
