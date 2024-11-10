export interface UltimosCapitulosManwhaResponse {
  id: number;
  titulo: string;
  enlace: string;
  portada: string;
  estado: string | null;
  latest_chapter: LatestChapter | null;
}

export interface LatestChapter {
  id: number;
  name: string;
  published_at: string;  
}