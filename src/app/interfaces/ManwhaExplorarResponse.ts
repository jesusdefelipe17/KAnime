  export interface ManwhaExplorarResponse {
    Manwhas:Manwhas [];
   }
 
   export interface Manwhas {
    descripcion: string;  // Descripción breve del anime
    poster: string;       // URL del póster del anime
    puntuacion: string;   // Puntuación del anime
    tipo: string;         // Tipo de anime (e.g., Especial, Película, Serie)
    titulo: string;       // Título del anime
    url: string;          // Enlace a la página del anime en AnimeFLV
    id:string;
    chapter_count: number;
   }