import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  userId: number; // Aquí almacenarás el ID del usuario

  constructor(private storage: Storage, private navCtrl: NavController) { }

  async ngOnInit() {
    await this.storage.create(); // Asegúrate de inicializar Ionic Storage

    // Verificamos si ya hay una sesión iniciada
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if (!isLoggedIn) {
      // Si no ha iniciado sesión, lo redirigimos a la página de login
      this.navCtrl.navigateRoot('/login');
    } else {
      // Si ha iniciado sesión, recuperamos el ID del usuario
      this.userId = await this.storage.get('userId');
      this.loadUserData(this.userId); // Carga la información del usuario
    }
  }

  async loadUserData(userId: number) {
    // Aquí puedes cargar la información del usuario desde SQLite o desde otro servicio
    console.log('Cargando datos para el usuario con ID:', userId);
    // Implementa tu lógica aquí
  }
}
