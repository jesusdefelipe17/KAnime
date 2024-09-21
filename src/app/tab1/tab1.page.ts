import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { servicioPelicula } from '../services/servicioPelicula';
import { AnimeResponse } from '../interfaces/AnimeResponse';
import { IonSlides, ToastController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/data-base.service';
import { AnimePerfilResponse } from '../interfaces/AnimePerfilResponse';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {

  todos;
  animes: AnimeResponse[] = []; 
  addAnime: AnimePerfilResponse;
  cargarPeliculasPopulares: boolean = false;
  @ViewChild('slides', { static: false }) slides: IonSlides;

  slideOpts = {
    slidesPerView: 2,
    spaceBetween: 1,
    freeMode: true,
    grabCursor: true,
    speed: 600,
    loop: false,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  };

  popularesSlideOpts = {
    slidesPerView: 3, // Número de slides visibles
    spaceBetween: 10, // Espacio entre los slides
    freeMode: true, // Desactiva el modo libre de slides
    loop: false, // Desactiva el loop
    autoplay: false, // Desactiva el autoplay
  };
  
  
  readonly TITLE_MAX_LENGTH = 12;

  populares = [];
  recienAnadidos = [];
  aleatorio: any = null;
  username : string;
  favoritos: { idAnime: string }[] = []; // Cambiado para que sea un arreglo de objetos
  filledHearts: Set<string> = new Set(); // Para guardar los IDs de animes llenos
  @ViewChild('openToast', { static: false }) openToast: any;
  
  constructor(private servioPelicula: servicioPelicula,private router: Router, private dbService: DatabaseService, private toastController: ToastController) {}

  truncateText(text: string): string {
    if (text.length > this.TITLE_MAX_LENGTH) {
      return text.substring(0, this.TITLE_MAX_LENGTH) + '...';
    }
    return text;
  }

  ngOnInit(): void {
      this.dbService.favoritos$.subscribe(favoritos => {
          this.favoritos = favoritos; // Actualiza la lista de favoritos
      });

      // Cargar animes populares y otros datos
      forkJoin({
          popularMovies: this.servioPelicula.getPopularMovies(),
          ratingAnimes: this.servioPelicula.getRatingAnimes(),
          recienAnadidos: this.servioPelicula.getRecienAnadidos(),
      }).subscribe(async ({ popularMovies, ratingAnimes, recienAnadidos }) => {
          this.animes = popularMovies;
          this.populares = ratingAnimes.map(item => ({
              ...item,
              titulo: this.truncateText(item.titulo)
          }));
          this.recienAnadidos = recienAnadidos;

          this.username = await this.dbService.getUser();
          if (this.username) {
              await this.dbService.loadUserAnimes(this.username); // Cargar favoritos
          }

          if (this.recienAnadidos.length > 0) {
              const randomIndex = Math.floor(Math.random() * this.recienAnadidos.length);
              this.aleatorio = this.recienAnadidos[randomIndex];
          }

          this.cargarPeliculasPopulares = true;
      });
  }

  ngAfterViewInit() {
    // Mover el código que usa this.slides aquí
    if (this.slides) {
      this.slides.startAutoplay(); // Inicia el autoplay
    }
  }

  errorHandler(event) {
    console.debug(event);
    event.target.src = "https://cdn.browshot.com/static/images/not-found.png";
  }

  getTypeClass(tipo: string): string {
    switch (tipo) {
      case 'Anime':
        return 'type-anime';
      case 'Pelicula':
        return 'type-pelicula';
      case 'OVA':
        return 'type-ova';
      default:
        return '';
    }
  }

  navigateToPerfil(id: string) {
    this.router.navigate(['/anime-perfil', id]);
  }

  isFavorito(animeId: string): boolean {
    return this.favoritos.some(fav => fav.idAnime === animeId);
  }

  async guardarAnime(idAnime: string) {
    if (!this.isFavorito(idAnime)) {
      forkJoin({
        datosAnime: this.servioPelicula.getAnimePerfil(idAnime),
        recienAnadidos: this.servioPelicula.getRecienAnadidos()
      }).subscribe(async ({ datosAnime }) => {
        this.addAnime = datosAnime;

        if (this.username) {
          await this.dbService.addAnime(this.username, idAnime, this.addAnime.titulo, this.addAnime.calificacion, this.addAnime.poster);
          
           // Muestra el toast
        
           this.presentToast('bottom','Añadido a favoritos','success');

          // Actualiza la lista de favoritos
          this.favoritos.push({ idAnime: idAnime });
          this.filledHearts.add(idAnime);
        }
      });
    } else {
    
      this.presentToast('bottom','Ya esta en favoritos','danger');
      
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