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
import { EpisodiosService } from '../services/episodiosService';
import { servicioPelicula } from '../services/servicioPelicula';
import { ManwhaExplorarResponse, Manwhas } from '../interfaces/ManwhaExplorarResponse';

@Component({
  selector: 'app-manwha-perfil',
  templateUrl: './manwha-perfil.page.html',
  styleUrls: ['./manwha-perfil.page.scss'],
})
export class ManwhaPerfilPage implements OnInit {

 
  id: string;
  cargarManwha: boolean = false;
  manwha: ManwhaPerfilResponse;
  manwhasFiltrados: Manwhas[] = [];;
  selectedTab: string = 'episodes'; // Pestaña por defecto
  paginaActual: number = 0; // Mantiene el número de la página actual para la paginación
  cargandoMasEpisodios: boolean = false; // Indica si se están cargando más episodios
  hayMasEpisodios: boolean = true; // Indica si hay más episodios para cargar
  episodios:CapitulosResponse[];
  username : string;
  favoritos: { idAnime: string }[] = []; // Cambiado para que sea un arreglo de objetos
  filledHearts: Set<string> = new Set(); // Para guardar los IDs de animes llenos
  @ViewChild('openToast', { static: false }) openToast: any;
  episodiosLeidos = new Set<string>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioManga: servicioManga,
    private episodiosService: EpisodiosService,
    private toastController: ToastController,
    private servicioAnime: servicioPelicula,
    private dbService: DatabaseService
  ) { 

   
  }

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.episodiosService.episodiosLeidos$.subscribe(leidos => {
      this.episodiosLeidos = leidos;
    });
    this.dbService.favoritos$.subscribe(favoritos => {
      this.favoritos = favoritos; // Actualiza la lista de favoritos
  });
    this.username = await this.dbService.getUser();

  this.cargarManwhaPerfil();
  }

  cargarManwhaPerfil() {
    this.servicioManga.getManwhaPerfil(this.id).subscribe({
        next: (manwha: ManwhaPerfilResponse) => {
            this.manwha = manwha;

            // Mapeo de géneros de texto a su valor numérico
            const genreMapping: { [key: string]: number } = {
                'Accion': 1,
                'Misterio': 20,
                'Supernatural': 56,
                'Vidaescolar': 38,
                'Reencarnacion': 25,
                'Demonios': 44,
                'Shonen': 28,
                'Artesmarciales': 4,
                'Magia': 19
            };

            // Convertir this.manwha.genero a su valor numérico
            const generoId = genreMapping[this.manwha.genero] || 0; // 0 en caso de no encontrar el género

            // Llamada a getCargarManwhasFiltrados con el género convertido
            this.servicioManga.getCargarManwhasFiltrados(generoId, 1).subscribe({
                next: (manwhasFiltrados) => {
                    this.manwhasFiltrados = manwhasFiltrados;  // Asignar resultados a una variable de la clase
                    this.cargarManwha = true;
                },
                error: (err) => {
                    console.error('Error al cargar los manwhas filtrados:', err);
                    this.cargarManwha = false;
                }
            });
        },
        error: (err) => {
            console.error('Error al cargar el perfil del manga:', err);
            this.cargarManwha = false;
        }
    });
}

  
                               

  onTabChange(event: any) {
    this.selectedTab = event.detail.value;
  }

  irALeerCapitulo(url: string, titulo: string, episodioId: string) {
    this.episodiosService.marcarComoLeido(episodioId); // Marcar como leído en el servicio
    this.router.navigate(['/read-manwha-chapter', url, titulo]);
  }


  isFavorito(manwha: any): boolean {
    return this.favoritos.some(fav => fav.idAnime === 'https://zonaolympus.com/series/comic-'+manwha['url']);
  }
  
  async guardarAnime(manwha: any) {
    if (!this.isFavorito(manwha)) {
      const datosAnime = await this.servicioManga.getManwhaPerfil('https://zonaolympus.com/series/comic-'+manwha['url']).toPromise();
      
      if (this.username) {
        await this.dbService.addAnime(this.username, 'https://zonaolympus.com/series/comic-'+manwha['url'] , datosAnime.titulo, datosAnime.calificacion, datosAnime.portada, true);
        
        this.presentToast('bottom','Añadido a favoritos','success');
        
        this.favoritos.push({ idAnime: manwha });
        this.filledHearts.add(manwha);
      }
    } else {
      this.presentToast('bottom','Ya está en favoritos','danger');
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom',message:string,color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: position,
      color: color
    });

    await toast.present();
  }
  

}
