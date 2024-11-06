import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { servicioManga } from '../services/servicioManga';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/data-base.service';
import { CapitulosResponse, MangaPerfilResponse } from '../interfaces/MangaPerfilResponse';
import { Router } from '@angular/router';
import { ManwhaPerfilResponse } from '../interfaces/ManwhaPerfilResponse';

@Component({
  selector: 'app-manwha-perfil',
  templateUrl: './manwha-perfil.page.html',
  styleUrls: ['./manwha-perfil.page.scss'],
})
export class ManwhaPerfilPage implements OnInit {

 
  id: string;
  cargarManwha: boolean = false;
  manwha: ManwhaPerfilResponse;
  selectedTab: string = 'episodes'; // Pestaña por defecto
  paginaActual: number = 0; // Mantiene el número de la página actual para la paginación
  cargandoMasEpisodios: boolean = false; // Indica si se están cargando más episodios
  hayMasEpisodios: boolean = true; // Indica si hay más episodios para cargar
  episodios:CapitulosResponse[];
  username : string;
  favoritos: { idAnime: string }[] = []; // Cambiado para que sea un arreglo de objetos
  filledHearts: Set<string> = new Set(); // Para guardar los IDs de animes llenos
  @ViewChild('openToast', { static: false }) openToast: any;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioManga: servicioManga,
  ) { 

   
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');


  this.cargarManwhaPerfil();
  }

  cargarManwhaPerfil() {
    this.cargarManwha = true;
    this.servicioManga.getManwhaPerfil(this.id).subscribe({
        next: (manwha: ManwhaPerfilResponse) => {
            this.manwha = manwha;

            this.cargarManwha = true;
        },
        error: (err) => {
            console.error('Error al cargar el manga:', err); // Manejo del error
            this.cargarManwha = false;
        }
    });
}
  
                               

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  irALeerCapitulo(url: string) {
    // Concatenar la parte de la URL que necesitas
    const nuevaUrl = url;
    // Codificar la URL para que sea compatible con el router
    const chapterUrl = encodeURIComponent(nuevaUrl);
    // Redirigir a la nueva ruta
    this.router.navigateByUrl(`/read-chapter/${chapterUrl}`);

  }
  

}
