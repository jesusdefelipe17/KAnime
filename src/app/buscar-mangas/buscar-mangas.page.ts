import { Component, OnInit } from '@angular/core';
import { servicioPelicula } from '../services/servicioPelicula';

import { ActivatedRoute, Router } from '@angular/router';
import { AnimeBusqueda } from '../interfaces/AnimeBusqueda';
import { servicioManga } from '../services/servicioManga';
import { MangaBusquedaResponse } from '../interfaces/MangaBusquedaResponse';

@Component({
  selector: 'app-buscar-mangas',
  templateUrl: './buscar-mangas.page.html',
  styleUrls: ['./buscar-mangas.page.scss'],
})
export class BuscarMangasPage implements OnInit {
  buscando: boolean = false; // Estado de "Cargando..."
  resultadosFiltrados: MangaBusquedaResponse[] = []; // Resultados filtrados por la búsqueda
  private searchTimeout: any; // Variable para manejar el debounce
  searchQuery: string = ''; // Para manejar la búsqueda
  animes: MangaBusquedaResponse[] = []; // Para almacenar los resultados del servicio
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private mangaServicio: servicioManga ) { }

  ngOnInit() {
  }


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
        this.mangaServicio.getMangaBusqueda(this.searchQuery).subscribe({
          next: (resultados: MangaBusquedaResponse[]) => {
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
      case 'En Emision':
        return 'type-emision';
      case 'Finalizado':
        return 'type-finalizado';
      default:
        return '';
    }
  }

  cancelSearch() {
    // Navegar a la pantalla anterior o la principal
    this.router.navigate(['/tab5']); // Cambia '/home' a la ruta a la que quieras regresar
  }
}