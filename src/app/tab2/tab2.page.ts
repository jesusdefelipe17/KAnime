import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { DatabaseService } from '../services/data-base.service';
import { Storage } from '@ionic/storage-angular';
import { Subscription } from 'rxjs';

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
  animeSubscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private dbService: DatabaseService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    this.isNative = this.platform.is('cordova') || this.platform.is('capacitor');

    await this.loadUserData();
    await this.loadUserAnimes();

    // Suscribirse a los cambios en la lista de animes
    this.animeSubscription = this.dbService.animes$.subscribe((animes) => {
      this.animes = animes;
    });
  }

  async loadUserData() {
    try {
      if (this.isNative) {
        const users = await this.dbService.getUsers();
        if (users.length > 0) {
          const user = users[0];
          this.userId = user.id;
          this.username = user.username;
        }
      } else {
        this.username = await this.storage.get('user');
      }

      if (!this.username) {
        this.navCtrl.navigateRoot('/login');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      this.navCtrl.navigateRoot('/login');
    }
  }

  async loadUserAnimes() {
    if (this.username) {
      const animes = await this.dbService.getUserAnimes(this.username);
      this.dbService.animesSubject.next(animes); // Inicializar los animes en el BehaviorSubject
    }
  }

  async deleteAnime(animeId: string) {
    await this.dbService.deleteAnime(animeId);
  }

  ngOnDestroy() {
    // Asegurarse de cancelar la suscripción cuando el componente se destruya
    if (this.animeSubscription) {
      this.animeSubscription.unsubscribe();
    }
  }
}
