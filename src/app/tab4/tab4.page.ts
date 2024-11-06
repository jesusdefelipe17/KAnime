import { Component, OnInit, ViewChild } from '@angular/core';
import { servicioManga } from '../services/servicioManga';
import { MangaPopularResponse } from '../interfaces/MangaPopularResponse';
import { AnimePerfilResponse } from '../interfaces/AnimePerfilResponse';
import { IonSlides, ToastController } from '@ionic/angular';
import { AnimeResponse } from '../interfaces/AnimeResponse';
import { forkJoin } from 'rxjs';
import { servicioPelicula } from '../services/servicioPelicula';
import { DatabaseService } from '../services/data-base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  mangasPopulares: MangaPopularResponse[] = [];  // Variable para almacenar los mangas populares
  manwhasPopulares: MangaPopularResponse[] = [];
  buscando:boolean = false

  todos;
  animes: AnimeResponse[] = []; 
  ultimosCapitulosManga: MangaPopularResponse[] = []; 
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
      delay: 2000,
      disableOnInteraction: false
    },
  };

  popularesSlideOpts = {
    slidesPerView: 3, // Número de slides visibles
    spaceBetween: 10, // Espacio entre los slides
    freeMode: true, // Desactiva el modo libre de slides
    loop: false, // Desactiva el loop
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
  };
  
  
  readonly TITLE_MAX_LENGTH = 12;

  recienAnadidos = [];
  aleatorio: any = null;
  username : string;
  favoritos: { idAnime: string }[] = []; // Cambiado para que sea un arreglo de objetos
  filledHearts: Set<string> = new Set(); // Para guardar los IDs de animes llenos
  @ViewChild('openToast', { static: false }) openToast: any;
  

  constructor(private mangaService: servicioManga,private servioPelicula: servicioPelicula,private router: Router, private dbService: DatabaseService, private toastController: ToastController) { }

  ngOnInit() {
    this.buscando = true;
   
    
     // Cargar animes populares y otros datos
     forkJoin({
      mangaPopulares: this.mangaService.getMangaPopulares(),
      ultimosCapitulosManga: this.mangaService.getMangaUltimosCapitulos(),
      manwhasPopulares: this.mangaService.getManwhasPopulares()
  }).subscribe(async ({ mangaPopulares, ultimosCapitulosManga, manwhasPopulares }) => {
      this.mangasPopulares = mangaPopulares;
      this.ultimosCapitulosManga = ultimosCapitulosManga;
      this.manwhasPopulares = manwhasPopulares;

      if (this.ultimosCapitulosManga.length > 0) {
          const randomIndex = Math.floor(Math.random() * this.ultimosCapitulosManga.length);
          this.aleatorio = this.ultimosCapitulosManga[randomIndex];
      }

      this.cargarPeliculasPopulares = true;
      this.buscando = false;
  });
  }

  truncateText(text: string): string {
    if (text.length > this.TITLE_MAX_LENGTH) {
      return text.substring(0, this.TITLE_MAX_LENGTH) + '...';
    }
    return text;
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
      case 'En Emision':
        return 'type-emision';
      case 'Finalizado':
        return 'type-finalizado';
      default:
        return '';
    }
  }

  navigateToPerfil(id: string) {
    this.router.navigate(['/anime-perfil', id]);
  }

}
