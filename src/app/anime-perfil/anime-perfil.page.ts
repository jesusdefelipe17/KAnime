import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { servicioPelicula } from '../services/servicioPelicula';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-anime-perfil',
  templateUrl: './anime-perfil.page.html',
  styleUrls: ['./anime-perfil.page.scss'],
})
export class AnimePerfilPage implements OnInit {

  id: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servioPelicula: servicioPelicula,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log( this.id)

    
  }

  close() {
    this.router.navigate(['../']);
  }


}
