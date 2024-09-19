export interface Video {
    code: string;
    server: string;
    titulo: string;
    url: string;
  }
  
  export interface EpisodiosResponse {
    episodio: string;              
    enlace: string;
    videos: Video[];
  }
  