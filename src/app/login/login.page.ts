import { Component, OnInit } from '@angular/core';
import { usuario } from '../interfaces/usuario';
import { BaseDatosService } from '../services/base-datos.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';  // Importa Ionic Storage
import { DatabaseService } from '../services/data-base.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  user2: usuario;
  user: string;
  pass: string;
  repetirPass: string;
  usuario: usuario = new usuario();

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private navCtrl: NavController,
    private storage: Storage,
    private dataBaseService :DatabaseService
  ) {}

  async ngOnInit() {
    // Aquí podrías verificar si ya hay sesión iniciada en este punto
    const isLoggedIn = await this.storage.get('isLoggedIn');
    if (isLoggedIn) {
      // Si ya está logueado, redirige a la página principal
      this.navCtrl.navigateRoot('/tab2');
    }
  }

  async login() {
    // Buscar el usuario por nombre de usuario
    const existingUser = await this.dataBaseService.findUserByUsername(this.user);
    
    if (!existingUser) {
      // Si no existe, crea un nuevo usuario en la base de datos
      this.usuario.username = this.user;  // Asigna el nombre de usuario
  
      await this.dataBaseService.addUser(this.usuario.username);  // Método para agregar el usuario
    } else {
      // Si el usuario existe, verifica la contraseña
      if (existingUser.pass !== this.pass) {
        this.showToast();  // Contraseña incorrecta
        return;
      }
    }
  
    // Si la autenticación es exitosa, guarda el estado de la sesión
    await this.storage.set('isLoggedIn', true);
    await this.storage.set('username', existingUser ? existingUser.username : this.usuario.username);  // Asegúrate de usar el ID del usuario existente
  
    // Redirigir al usuario a la página principal
    this.navCtrl.navigateRoot('/tab2');
  }
  
  showToast() {
    this.toastCtrl.create({
      message: 'Error al iniciar sesión. Inténtalo de nuevo',
      duration: 2000,
      cssClass: 'yourClass',
      position: 'middle'
    }).then((obj) => {
      obj.present();
    });
  }
}
