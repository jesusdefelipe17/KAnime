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
  ascendingOrder: 'asc' | 'desc' = 'asc'; // Usamos 'asc' o 'desc'
  filterPanelOpen = false; // Para controlar la visibilidad del panel de filtros
  selectedGenero: number | null = null; // Género seleccionado para el filtro

  isFiltrado = false;

  filters = {
    Todos: 0,
    Accion: 1,
    Misterio: 20,
    Supernatural:56,
    Vidaescolar:38,
    Reencarnacion:25,
    Demonios:44,
    Shonen:28,
    Artesmarciales:4,
    Magia:19
  };

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

  // Llama al servicio para obtener los manwhas, soporta paginación y filtros
  fetchManwhaList() {
    this.buscando = true;

    this.mangaServicio.getCargarManwhas(this.currentPage, this.ascendingOrder).subscribe({
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

    // Vuelve a llamar a la función de carga con el género seleccionado si hay
    if(this.isFiltrado){
      this.paginadosManwhasFiltrados();
    }else{
      this.fetchManwhaList();  // Carga los manwhas de la nueva página
    }
   
    event.target.complete();  // Indica que la carga ha terminado
  }

  // Función para navegar a la pantalla de búsqueda
  navigateToSearch() {
    this.router.navigate(['/buscar-mangas']);
  }

  // Método para alternar la visibilidad del panel de filtros
  toggleFilterPanel() {
    this.filterPanelOpen = !this.filterPanelOpen;
  }

  paginadosManwhasFiltrados(){

    this.mangaServicio.getCargarManwhasFiltrados(this.selectedGenero, this.currentPage).subscribe({
      next: (manwhaData: any[]) => {
        // Si es la primera página, reemplaza los datos

        this.manwhaList = [...this.manwhaList, ...manwhaData];
        this.buscando = false;
      },
      error: (error) => {
        console.error('Error al obtener Manwhas:', error);
        this.buscando = false;
      }
    });
  }
  // Método para aplicar los filtros
  applyFilters() {
    // Si no hay género seleccionado, enviar null
    const generoSeleccionado = this.selectedGenero || null;
    this.currentPage=1;
    if(generoSeleccionado ==null){
    this.isFiltrado = false;
    }else{
      this.isFiltrado = true;
    }
    // Llamamos al servicio con el número del género seleccionado
    this.mangaServicio.getCargarManwhasFiltrados(generoSeleccionado, this.currentPage).subscribe({
      next: (manwhaData: any[]) => {
        // Si es la primera página, reemplaza los datos
        this.manwhaList = manwhaData;
        this.buscando = false;
      },
      error: (error) => {
        console.error('Error al obtener Manwhas:', error);
        this.buscando = false;
      }
    });

    // Cerrar el panel de filtros
    this.filterPanelOpen = false;
  }

  // Función para cerrar el panel de filtros
  closeFilterPanel() {
    this.filterPanelOpen = false;
  }

// Función para obtener el estilo según el tipo de manwha
getTypeClass(tipo: string): string {
  switch (tipo) {
    case 'Activo':
      return 'type-emision';
    case 'Finalizado':
      return 'type-finalizado';
    default:
      return '';
  }
}

toggleSortOrder() {
  // Alterna entre 'asc' y 'desc'
  this.ascendingOrder = (this.ascendingOrder === 'asc') ? 'desc' : 'asc';

  // Después de cambiar el orden, llama a sortList para aplicar el orden en la lista
  this.sortList();
}

sortList() {
  if (this.selectedTab === 'manwha') {
    this.fetchManwhaList();
  } else if (this.selectedTab === 'manga') {
    this.fetchManwhaList();
  }
}

}