import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { servicioPelicula } from '../services/servicioPelicula';
import { AnimeResponse } from '../interfaces/AnimeResponse';
import { IonSlides } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, AfterViewInit {
  todos;
  animes: AnimeResponse[] = []; 
  cargarPeliculasPopulares: boolean = false;
  @ViewChild('slides', { static: false }) slides: IonSlides;

  slideOpts = {
    slidesPerView: 2,
    spaceBetween: 1,
    freeMode: true,
    grabCursor: true,
    speed: 600,
    loop: true,
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
  
  constructor(private servioPelicula: servicioPelicula,private router: Router) {}

  truncateText(text: string): string {
    if (text.length > this.TITLE_MAX_LENGTH) {
      return text.substring(0, this.TITLE_MAX_LENGTH) + '...';
    }
    return text;
  }

  ngOnInit(): void {
    forkJoin({
      popularMovies: this.servioPelicula.getPopularMovies(),
      ratingAnimes: this.servioPelicula.getRatingAnimes(),
      recienAnadidos: this.servioPelicula.getRecienAnadidos()
    }).subscribe(({ popularMovies, ratingAnimes, recienAnadidos }) => {
      this.animes = popularMovies;

      this.populares = ratingAnimes.map(item => ({
        ...item,
        titulo: this.truncateText(item.titulo)
      }));

      this.recienAnadidos = recienAnadidos;
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
  
}
