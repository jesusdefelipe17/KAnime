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
import { MangaPopularResponse } from '../interfaces/MangaPopularResponse';
import { MangaPerfilResponse } from '../interfaces/MangaPerfilResponse';
import { MangaBusquedaResponse } from '../interfaces/MangaBusquedaResponse';
import { ManwhaPerfilResponse } from '../interfaces/ManwhaPerfilResponse';
import { map } from 'rxjs/operators';
import { ManwhaExplorarResponse } from '../interfaces/ManwhaExplorarResponse';
import { UltimosCapitulosManwhaResponse } from '../interfaces/UltimosCapitulosManwhaResponse';


@Injectable({
  providedIn: 'root'
})
export class servicioManga {
  

  urlSafe: SafeResourceUrl;
  url:string;

  //private baseUrl = 'http://127.0.0.1:8000'; 
  private baseUrl = 'https://web-production-b3a6.up.railway.app'

  constructor(private http:HttpClient,public sanitizer: DomSanitizer) { }


getMangaPopulares() : Observable<MangaPopularResponse[]>{
    const path = `${this.baseUrl}/api/MangasPopulares`;
    return this.http.get<MangaPopularResponse[]>(path);
}

getManwhasPopulares() : Observable<MangaPopularResponse[]>{
  const path = `${this.baseUrl}/api/ManwhasPopulares`;
  return this.http.get<MangaPopularResponse[]>(path);
}

getMangaPerfil(manga): Observable<MangaPerfilResponse> {
  const path = `${this.baseUrl}/api/getMangaPerfil?manga=${manga}`;
  return this.http.get<MangaPerfilResponse>(path);
}

getManwhaPerfil(manwha): Observable<ManwhaPerfilResponse> {
  const path = `${this.baseUrl}/api/getManwhaPerfil?manwha=${manwha}`;
  return this.http.get<ManwhaPerfilResponse>(path);
}

getCargarNuevosCapitulosManwha(): Observable<UltimosCapitulosManwhaResponse[]> {
  const path = `${this.baseUrl}/api/cargarNuevosCapitulosManwha`;
  return this.http.get<UltimosCapitulosManwhaResponse[]>(path);
}

cargarCapitulos(url): Observable<string[]> {
  const path = `${this.baseUrl}/api/getMangaImages?url=${url}`;
  return this.http.get<string[]>(path);
}

cargarCapitulosManwha(url): Observable<string[]> {
  const path = `${this.baseUrl}/api/cargarCapitulosManwha?url=${url}`;
  return this.http.get<any>(path).pipe(
    map(response => response.pages) // Extrae solo las páginas del capítulo
  );
}

getCargarManwhas(page: number,ascendingOrder:string ): Observable<any[]> {
  const path = `${this.baseUrl}/api/cargarManwhas?page=${page}&direction=${ascendingOrder}`;
  return this.http.get<any[]>(path).pipe(
    map(response => response) // Extrae solo las páginas del capítulo
  );
  
}

getCargarManwhasFiltrados(genero: number,pagina:number): Observable<any[]> {
  const path = `${this.baseUrl}/api/getManhwasPorGeneros?generos=${genero}&pagina=${pagina}`;
  return this.http.get<any[]>(path).pipe(
    map(response => response) // Extrae solo las páginas del capítulo
  );
  
}



getMangaBusqueda(manga): Observable<MangaBusquedaResponse[]> {
  const path = `${this.baseUrl}/api/getManga?manga=${manga}`;
  return this.http.get<MangaBusquedaResponse[]>(path);
}
getManwhaBusqueda(manga): Observable<MangaBusquedaResponse[]> {
  const path = `${this.baseUrl}/api/getManwhaBusqueda?nombre=${manga}`;
  return this.http.get<MangaBusquedaResponse[]>(path);
}

getMangaUltimosCapitulos() : Observable<MangaPopularResponse[]>{
  const path = `${this.baseUrl}/api/MangaUltimosCapitulos`;
  return this.http.get<MangaPopularResponse[]>(path);
}



}
