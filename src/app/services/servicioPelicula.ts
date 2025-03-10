import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AnimeResponse} from '../interfaces/AnimeResponse';
import { trailer } from '../interfaces/trailer';
import { valoresPeliculas } from '../interfaces/valoresPeliculas';
import { reparto } from '../interfaces/reparto';
import { busqueda } from '../interfaces/busqueda';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { series } from '../interfaces/series';
import { serie } from '../interfaces/serie';
import { temporada } from '../interfaces/temporada';
import { environment } from 'src/environments/environment';
import { peliculaTMB } from '../interfaces/peliculaTMB';
import { AnimePerfilResponse } from '../interfaces/AnimePerfilResponse';
import { Observable } from 'rxjs';
import { EpisodiosResponse } from '../interfaces/EpisodiosResponse';
import { VideoEpisodioResponse } from '../interfaces/VideoEpisodioResponse';
import { AnimeBusqueda } from '../interfaces/AnimeBusqueda';


@Injectable({
  providedIn: 'root'
})
export class servicioPelicula {
  

  urlSafe: SafeResourceUrl;
  url:string;

  //private baseUrl = 'http://127.0.0.1:8000'; 
  private baseUrl = 'https://web-production-b3a6.up.railway.app'

  constructor(private http:HttpClient,public sanitizer: DomSanitizer) { }


getPopularMovies() {
    const path = `${this.baseUrl}/api/ultimosAnimes`;
    return this.http.get<AnimeResponse[]>(path);
}

getAnimePerfil(anime) {
  const path = `${this.baseUrl}/api/getAnimePerfil?anime=${anime}`;
  return this.http.get<AnimePerfilResponse>(path);
}

getEpisodiosAnime(url_anime: string, pagina: number) {
  const path = `${this.baseUrl}/api/episodios?url_serie=https://www3.animeflv.net/anime/${url_anime}&pagina=${pagina}`;
  return this.http.get<EpisodiosResponse[]>(path);
}

getEpisodiosAnimeVideo(url_anime) {
  const path = `${this.baseUrl}/api/videos?url_episodio=https://www3.animeflv.net/ver/${url_anime}`;
  return this.http.get<VideoEpisodioResponse[]>(path);
}

getAnimeBusqueda(anime: string): Observable<AnimeBusqueda[]> {
  const path = `${this.baseUrl}/api/getAnime?anime=${anime}`;
  return this.http.get<AnimeBusqueda[]>(path);
}

getAnimesByGenre(generos: string[]): Observable<AnimeResponse[]> {
  // Filtrar géneros para eliminar aquellos que son undefined o están vacíos
  generos = this.obtenerDosGenerosAleatorios(generos).filter(genero => genero !== undefined && genero.trim() !== '');

  // Construir la URL añadiendo múltiples parámetros 'genre' en función del array de géneros
  const params = generos.map(genero => `genre=${encodeURIComponent(genero.toLowerCase())}`).join('&');
  const path = `${this.baseUrl}/api/getAnimesByGenre?${params}`;
  
  // Realizar la solicitud HTTP con los géneros filtrados y aleatorios
  return this.http.get<AnimeResponse[]>(path);
}




getRecienAnadidos() {
  const path = `${this.baseUrl}/api/getRecienAnadidos`;
  return this.http.get<AnimeResponse[]>(path);
}


getRatingAnimes() {
  const path = `${this.baseUrl}/api/getPopulares`;
  return this.http.get<AnimeResponse[]>(path);
}

  getPeliculaBusquedaScript(nombrePelicula) {
    const path = `${this.baseUrl}/getPeliculaBusquedaScript/${nombrePelicula}`;
    return this.http.get<string>(path);
  }

  getPelicula(nombrePelicula){
    const path = `${this.baseUrl}/getPelicula/${nombrePelicula}`;
    console.log(path);
    return this.http.get<valoresPeliculas>(path);
  }
  getTrailer(numPeli){
    var path = 'https://api.themoviedb.org/3/movie/'.concat(numPeli).concat('/videos?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES');
    console.log(path);
    return this.http.get<trailer>(path);
  }

  getRepartoPelicula(numPeli){
    var path = 'https://api.themoviedb.org/3/movie/'.concat(numPeli).concat('/credits?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES');
    console.log(path);
    return this.http.get<reparto>(path);
  }


  getPeliculaBusqueda(nombrePelicula){
    var path = 'https://onetvapi.onrender.com/getPeliculaBusquedaScript/'.concat(nombrePelicula);
    console.log(path);
    return this.http.get<busqueda>(path);
  }
  
  getNumPelicula(nombrePeli: string) {
    const apiKey = 'f206e13c8124d66161320fc69ca6960d';
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjA2ZTEzYzgxMjRkNjYxNjEzMjBmYzY5Y2E2OTYwZCIsIm5iZiI6MTcyNDU5NTEzOS4wOTQ1NjksInN1YiI6IjVmYTMyMzkzZjkyNTMyMDA0MGY2YTVkMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.x35oeEgmSjZj6faaz-HBySorrK9_GyhnojTmJXvT5y4';
    
    const path = `https://api.themoviedb.org/3/search/movie?query=${nombrePeli}&include_adult=false&language=es-ES&page=1`;
  
    const headers = new HttpHeaders({
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    console.log(path);
  
    return this.http.get<peliculaTMB>(path, { headers });
  }


  getSeriePopular(){
    var path = 'https://api.themoviedb.org/3/tv/popular?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES&page=1';
    console.log(path);
    return this.http.get<series>(path);
  }
  getSerie(numSerie){
    var path = 'https://api.themoviedb.org/3/tv/'.concat(numSerie).concat('?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES');
    console.log(path);
    return this.http.get<serie>(path);
  }
  getEpisodios(numTemporada,idSerie){
    var path = 'https://api.themoviedb.org/3/tv/'.concat(idSerie).concat('/season/').concat(numTemporada).concat('?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES');
    console.log(path);
    return this.http.get<temporada>(path);
  }
  getEpisodio(numTemporada,idSerie,idCapitulo){
    var path = 'https://api.themoviedb.org/3/tv/'.concat(idSerie).concat('/season/').concat(idCapitulo).concat('/episode/').concat(numTemporada).concat('?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES');
    console.log(path);
    return this.http.get<temporada>(path);
  }
  getEpisodioReparto(idSerie,numTemporada){ 
    var path = 'https://api.themoviedb.org/3/tv/'.concat(idSerie).concat('/season/').concat(numTemporada).concat('/credits?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES');
    console.log(path);
    return this.http.get<reparto>(path);
  }
 
  getSerieBusqueda(palabraBusqueda){ 
    var path = 'https://api.themoviedb.org/3/search/tv?api_key=f206e13c8124d66161320fc69ca6960d&language=es-ES&query='.concat(palabraBusqueda).concat('&page=1&include_adult=false');
  
    return this.http.get<busqueda>(path);
  }

  obtenerDosGenerosAleatorios(generos: string[]): string[] {
    const randomGeneros = [];
    // Copia superficial para evitar modificar el array original
    const generosCopy = [...generos];
  
    // Seleccionar dos géneros aleatorios
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * generosCopy.length);
      randomGeneros.push(generosCopy.splice(randomIndex, 1)[0]); // Extraer y remover el género seleccionado
    }
  
    return randomGeneros;
  }
}
