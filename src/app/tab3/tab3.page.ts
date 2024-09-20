import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { servicioPelicula } from '../services/servicioPelicula'; // Servicio importado
import { AnimeBusqueda } from '../interfaces/AnimeBusqueda';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  usuario: string;
  user2;
  buscando: boolean = false; // Estado de "Cargando..."
  searchQuery: string = ''; // Para manejar la búsqueda
  animes: AnimeBusqueda[] = []; // Para almacenar los resultados del servicio
  resultadosFiltrados: AnimeBusqueda[] = []; // Resultados filtrados por la búsqueda

  private searchTimeout: any; // Variable para manejar el debounce

  constructor(
    private activatedRoute: ActivatedRoute,
    private control: Router,
    private animeService: servicioPelicula // Servicio inyectado
  ) {}

  ngOnInit() {
    // Inicialmente, no hay animes cargados
    this.resultadosFiltrados = this.animes; 
  }

  // Función para manejar el cambio en la barra de búsqueda con debounce
  onSearchChange(event) {
    this.resultadosFiltrados=[];
    const valorBusqueda = event.target.value || ''; // Si `event.target.value` es undefined, asignar una cadena vacía
    this.searchQuery = valorBusqueda.toLowerCase(); // Convertir a minúsculas

    // Mostrar el estado de "Cargando..." inmediatamente cuando el usuario comience a escribir
    this.buscando = true;

    // Cancelar la búsqueda anterior si el usuario sigue escribiendo
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Establecer un temporizador para esperar 1,5 segundos antes de realizar la búsqueda
    this.searchTimeout = setTimeout(() => {
      // Si la búsqueda está vacía, mostrar todos los resultados
      if (this.searchQuery.trim() === '') {
        this.resultadosFiltrados = this.animes;
        this.buscando = false; // Ocultar "Cargando..." si no hay búsqueda
      } else {
        // Llamar al servicio para buscar animes basados en la búsqueda
        this.animeService.getAnimeBusqueda(this.searchQuery).subscribe({
          next: (resultados: AnimeBusqueda[]) => {
            // Actualizar los resultados filtrados con los resultados de la búsqueda
            this.resultadosFiltrados = resultados;
            this.buscando = false; // Ocultar "Cargando..." después de recibir la respuesta
            
          },
          error: (error) => {
            console.error('Error en la búsqueda de animes:', error);
            this.buscando = false; // Ocultar "Cargando..." en caso de error
          }
        });
      }
    }, 1500); // Esperar 1,5 segundos antes de realizar la búsqueda
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
}
