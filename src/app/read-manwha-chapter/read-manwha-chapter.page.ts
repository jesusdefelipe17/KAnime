import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { servicioManga } from '../services/servicioManga';
import { Router } from '@angular/router';
import { EpisodiosService } from '../services/episodiosService';
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
  prevChapter: any;
  nextChapter: any;

  @ViewChild('openToast', { static: false }) openToast: any;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private servicioManga: servicioManga,
    private episodiosService: EpisodiosService
  ) { 

   
  }
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.chapterUrl = decodeURIComponent(params['chapterUrl']); // Obtiene el primer parámetro (enlace)
      this.numCapitulo = decodeURIComponent(params['name']);
      
      this.cargarCapitulos();
      
    });
  }

  cargarCapitulos() {
    this.servicioManga.cargarCapitulosManwha(this.chapterUrl).subscribe({
      next: (pages) => {
        this.capitulo = pages['pages']; // Guardar las URLs de las páginas en la variable `capitulo`
        this.loading = false;
        this.prevChapter = pages['prev_chapter'];
        this.nextChapter = pages['next_chapter'];
      },
      error: (err) => {
        console.error('Error al cargar el manga:', err); // Manejo del error
        this.loading = false;
      }
    });
  }
  

  goToPreviousChapter() {
    if (this.prevChapter) {
      // Reemplaza el último número en la URL con `this.prevChapter.id`
      this.episodiosService.marcarComoLeido(this.prevChapter.id);
      const prevChapterUrl = this.chapterUrl.replace(/\/\d+$/, `/${this.prevChapter.id}`);
      this.router.navigateByUrl(`/read-manwha-chapter/${encodeURIComponent(prevChapterUrl)}/${this.prevChapter['name']}`, { replaceUrl: true });
    }
  }
  
  goToNextChapter() {
    if (this.nextChapter) {
      // Reemplaza el último número en la URL con `this.nextChapter.id`
      this.episodiosService.marcarComoLeido(this.nextChapter.id.toString());
      const nextChapterUrl = this.chapterUrl.replace(/\/\d+$/, `/${this.nextChapter.id}`);
      this.router.navigateByUrl(`/read-manwha-chapter/${encodeURIComponent(nextChapterUrl)}/${this.nextChapter['name']}`, { replaceUrl: true });
    }
  }
  
  


}


