import { Component, OnInit } from '@angular/core';
import { servicioManga } from '../services/servicioManga';
import { MangaPopularResponse } from '../interfaces/MangaPopularResponse';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  mangasPopulares: MangaPopularResponse[] = [];  // Variable para almacenar los mangas populares
  buscando:boolean = false

  constructor(private mangaService: servicioManga) { }

  ngOnInit() {
    this.buscando = true;
    // Suscribiéndonos al observable de mangas populares
    this.mangaService.getMangaPopulares().subscribe({
      next: (response: MangaPopularResponse[]) => {
        this.mangasPopulares = response; // Asigna los datos de la respuesta a la variable
        this.buscando = false;
      },
      error: (error) => {
        console.error('Error al obtener mangas populares:', error); // Manejar errores
        this.buscando = false;
      }
    });
  }

}
