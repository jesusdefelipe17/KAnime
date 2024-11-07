import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { servicioManga } from '../services/servicioManga';
import { Router } from '@angular/router';
@Component({
  selector: 'app-read-manwha-chapter',
  templateUrl: './read-manwha-chapter.page.html',
  styleUrls: ['./read-manwha-chapter.page.scss'],
})
export class ReadManwhaChapterPage implements OnInit {

  
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
    this.servicioManga.cargarCapitulosManwha(this.chapterUrl).subscribe({
      next: (pages) => {
        this.capitulo = pages; // Guardar las URLs de las páginas en la variable `capitulo`
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el manga:', err); // Manejo del error
        this.loading = false;
      }
    });
  }
  


}


