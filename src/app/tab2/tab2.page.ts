import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/data-base.service'; // Servicio de base de datos
import { Storage } from '@ionic/storage-angular'; // Importamos Ionic Storage para manejar la sesión

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  userId: number;
  username: string;
  isNative: boolean = false;
  animes: any[] = [];

  constructor(
    private navCtrl: NavController, 
    private platform: Platform, 
    private dbService: DatabaseService, 
    private storage: Storage // Inyectar Ionic Storage
  ) {}

  async ngOnInit() {
    // Verificamos si estamos en un entorno nativo o en el navegador
    await this.platform.ready();
    this.isNative = this.platform.is('cordova') || this.platform.is('capacitor');

    // Cargar los datos del usuario
    await this.loadUserData();
    await this.loadUserAnimes(); 
  }


  async loadUserData() {
    try {
      if (this.isNative) {
        // Si es una plataforma nativa, cargamos desde SQLite
        const users = await this.dbService.getUsers();
        if (users.length > 0) {
          const user = users[0]; // Asumimos que hay solo un usuario
          this.userId = user.id;
          this.username = user.username;
        }
      } else {
        // Si estamos en un navegador, cargamos desde Ionic Storage
        this.username = await this.storage.get('user');
      }

      // Verificamos si tenemos un usuario cargado
      if (this.username) {
        console.log('Usuario cargado:', this.username);
      } else {
        // Si no encontramos un usuario, redirigir al login
        this.navCtrl.navigateRoot('/login');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      this.navCtrl.navigateRoot('/login'); // Redirigir al login en caso de error
    }
  }

  async loadUserAnimes() {
    if (this.username) {
      //await this.addTestAnimes(this.username)
      this.animes = await this.dbService.getUserAnimes(this.username);
    }
  }

  async deleteAnime(animeId: string) {
    await this.dbService.deleteAnime(animeId);
    this.animes = await this.dbService.getUserAnimes(await this.dbService.getUser());
  }
  async addTestAnimes(username: string) {
    const animes = [
      {
        calificacion: "5.0",
        id: "tensei-shitara-slime-datta-ken-movie-guren-no-kizunahen",
        portada: "https://animeflv.net/uploads/animes/covers/3812.jpg",
        titulo: "Tensei shitara Slime Datta Ken Movie: Guren no Kizuna-hen",
      },
      {
        calificacion: "4.8",
        id: "kyoukai-no-kanata-movie-ill-be-here-mirai-hen",
        portada: "https://animeflv.net/uploads/animes/covers/2288.jpg",
        titulo: "Kyoukai no Kanata Movie: I'll Be Here - Mirai-hen",
      },
      {
        calificacion: "4.8",
        id: "steins-gate-fuka-ryoiki-no-deja-vu",
        portada: "https://animeflv.net/uploads/animes/covers/1182.jpg",
        titulo: "Steins;Gate Fuka Ryoiki no Deja vu",
      },
      {
        calificacion: "4.8",
        id: "kono-subarashii-sekai-ni-shukufuku-wo-kurenai-densetsu",
        portada: "https://animeflv.net/uploads/animes/covers/3279.jpg",
        titulo: "Kono Subarashii Sekai ni Shukufuku wo!: Kurenai Densetsu",
      },
      {
        calificacion: "4.8",
        id: "kaguyasama-wa-kokurasetai-ultra-romantic",
        portada: "https://animeflv.net/uploads/animes/covers/3613.jpg",
        titulo: "Kaguya-sama wa Kokurasetai: Ultra Romantic",
      },
      {
        calificacion: "4.8",
        id: "made-in-abyss-retsujitsu-no-ougonkyou",
        portada: "https://animeflv.net/uploads/animes/covers/3648.jpg",
        titulo: "Made in Abyss: Retsujitsu no Ougonkyou",
      },
    ];
  
    for (const anime of animes) {
      await this.dbService.addAnime(this.username, anime.id, anime.titulo, anime.calificacion, anime.portada);
    }
  
    console.log('Animes de prueba agregados para el usuario:', username);
  }
  
}
