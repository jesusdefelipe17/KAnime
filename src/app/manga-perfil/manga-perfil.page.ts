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
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-manga-perfil',
  templateUrl: './manga-perfil.page.html',
  styleUrls: ['./manga-perfil.page.scss'],
})
export class MangaPerfilPage implements OnInit {

  id: string;
  cargarManga: boolean = false;
  manga: MangaPerfilResponse;
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
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private dbService: DatabaseService, 
    private toastController: ToastController
  ) { 

   
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
   
  
    /*
  if (this.username) {
    await this.dbService.loadUserAnimes(this.username); // Cargar favoritos
  }
    */

  this.cargarMangaPerfil();
  }

  cargarMangaPerfil() {
    this.cargarManga = true;
    this.servicioManga.getMangaPerfil(this.id).subscribe({
        next: (manga: MangaPerfilResponse) => {
            this.manga = manga;

            // Transformar los capítulos en un array
            this.episodios = Object.keys(manga.capitulos)
                .map(key => {
                    return {
                        chapter_id: manga.capitulos[key].chapter_id,
                        titulo: `Capítulo ${parseInt(key)}`, // Asegúrate de personalizar el título según tu lógica
                    };
                })
                .sort((a, b) => parseInt(a.titulo.split(' ')[1]) - parseInt(b.titulo.split(' ')[1])); // Ordenar por el número del capítulo

            this.cargarManga = true;
        },
        error: (err) => {
            console.error('Error al cargar el manga:', err); // Manejo del error
            this.cargarManga = false;
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
