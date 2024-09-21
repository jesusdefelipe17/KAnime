import { Component, OnInit } from '@angular/core';
import { usuario } from '../interfaces/usuario';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from '../services/data-base.service'; // Servicio de base de datos

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  user: string;
  pass: string;
  usuario: usuario = new usuario();

  constructor(
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private storage: Storage, // Para almacenar el estado de sesión
    private dataBaseService: DatabaseService // Servicio de base de datos
  ) {}

  async ngOnInit() {
    // Verifica si ya hay una sesión iniciada
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if (isLoggedIn) {
      // Si ya ha iniciado sesión, redirigir a Tab2
      this.navCtrl.navigateRoot('/tabs/tab2');
    }
  }

  async login() {
    // Buscar el usuario en la base de datos por nombre
    const existingUser = await this.dataBaseService.findUserByUsername(this.user);
    
    if (!existingUser) {
      // Si no existe el usuario, crearlo en la base de datos
      await this.dataBaseService.addUser(this.user); // Crear el usuario en la base de datos
    }

    // Guardar el estado de la sesión en Ionic Storage
    await this.storage.set('isLoggedIn', true);
    await this.storage.set('user', this.user); // Guardar el nombre de usuario

    // Redirigir al usuario a Tab2
    this.navCtrl.navigateRoot('/tabs/tab2');
  }

  // Mostrar un mensaje de error si las credenciales son incorrectas
  showToast() {
    this.toastCtrl.create({
      message: 'Error al iniciar sesión. Inténtalo de nuevo.',
      duration: 2000,
      cssClass: 'yourClass',
      position: 'middle'
    }).then((obj) => {
      obj.present();
    });
  }
}
