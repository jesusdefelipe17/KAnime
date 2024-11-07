import { Component, OnInit } from '@angular/core';
import { servicioManga } from '../services/servicioManga';
import { MangaBusquedaResponse } from '../interfaces/MangaBusquedaResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {
  buscando: boolean = false;
  manwhaList: MangaBusquedaResponse[] = [];  // Lista de Manwhas
  mangaList: MangaBusquedaResponse[] = [];   // Lista de Mangas
  selectedTab: string = 'manwha';  // Tab seleccionado
  currentPage: number = 1;  // Página actual de manwhas
  searchQuery: string = '';  // Query de búsqueda (si fuera necesario)
  
  constructor(
    private router: Router,
    private mangaServicio: servicioManga
  ) { }

  ngOnInit() {
    this.fetchManwhaList();  // Cargar la primera página de manwhas
  }

  // Lógica para cambiar de tab
  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
    if (this.selectedTab === 'manwha') {
      this.fetchManwhaList();  // Cargar Manwhas al seleccionar 'manwha'
    } else {
      this.fetchMangaList();  // Cargar Mangas al seleccionar 'manga'
    }
  }

  // Llama al servicio para obtener los manwhas, soporta paginación
  fetchManwhaList() {
    this.buscando = true;
    this.mangaServicio.getCargarManwhas(this.currentPage).subscribe({
      next: (manwhaData: any[]) => {
        // Si es la primera página, reemplaza los datos
        if (this.currentPage === 1) {
          this.manwhaList = manwhaData["manwhas"];
        } else {
          // Si no es la primera página, concatena los datos
          this.manwhaList = [...this.manwhaList, ...manwhaData["manwhas"]];
        }
        this.buscando = false;
      },
      error: (error) => {
        console.error('Error al obtener Manwhas:', error);
        this.buscando = false;
      }
    });
  }

  // Llama al servicio para obtener los mangas (pendiente de implementar)
  fetchMangaList() {
    this.buscando = true;
    // Implementar la lógica para obtener los mangas, si lo necesitas
  }

  // Lógica para manejar el Infinite Scroll y cargar más datos
  cargarMasManwhas(event) {
    this.currentPage++;  // Incrementa la página actual
    this.fetchManwhaList();  // Carga los manwhas de la nueva página
    event.target.complete();  // Indica que la carga ha terminado
  }

  // Función para navegar a la pantalla de búsqueda
  navigateToSearch() {
    this.router.navigate(['/buscar-mangas']);
  }

  // Función para obtener el estilo según el tipo de manwha
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
}
