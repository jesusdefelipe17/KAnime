
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

@Component({
  selector: 'app-read-chapter',
  templateUrl: './read-chapter.page.html',
  styleUrls: ['./read-chapter.page.scss'],
})
export class ReadChapterPage implements OnInit {

  
  chapterUrl: string;
  loading: boolean = true;
  capitulo:string[];
  numCapitulo: string="";
  
  @ViewChild('openToast', { static: false }) openToast: any;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioManga: servicioManga,
  ) { 

   
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.chapterUrl = decodeURIComponent(params['chapterUrl']);
      
      this.cargarCapitulos();
      
    });
  }

  cargarCapitulos() {
    this.servicioManga.cargarCapitulos(this.chapterUrl).subscribe({
      next: (capitulo) => {
        this.capitulo = capitulo;  
        this.extraerNumeroCapitulo();
        this.loading=false;
      },
      error: (err) => {
        console.error('Error al cargar el manga:', err); // Manejo del error
        this.loading=false;
      }
    });
  }
  
   // Método para extraer el número de capítulo desde la URL
   extraerNumeroCapitulo() {
    
    let partes = this.capitulo[0].split("/")
    
    if (partes[5]) {
      this.numCapitulo = partes[7];  // Almacena '01', por ejemplo
      console.log("Número del capítulo:", this.numCapitulo);
    }
  }

}
