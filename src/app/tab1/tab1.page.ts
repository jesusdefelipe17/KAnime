import { Component, OnInit } from '@angular/core';
import { servicioPelicula } from '../services/servicioPelicula';
import { AnimeResponse } from '../interfaces/AnimeResponse';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  todos;
  animes: AnimeResponse[] = []; 
  cargarPeliculasPopulares:boolean = false;
  
  constructor(private servioPelicula :servicioPelicula ) {
    
  }

  ngOnInit(): void {
  
    
    this.getPopularMovie();
  }

  getPopularMovie(){
   

    this.servioPelicula.getPopularMovies().subscribe(response => {
      this.animes = response;
      this.cargarPeliculasPopulares = true;
     
  });
  }




  errorHandler(event) {
    console.debug(event);
    event.target.src = "https://cdn.browshot.com/static/images/not-found.png";
 }
}
