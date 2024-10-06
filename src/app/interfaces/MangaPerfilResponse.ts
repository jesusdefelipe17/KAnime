export interface MangaPerfilResponse {
    id: string;               // Identificador del manga (en minúsculas y con guiones)
    titulo: string;           // Título del manga
    poster: string;           // URL del póster
    calificacion: string;     // Calificación promedio (e.g., "4.9")
    descripcion: string;      // Descripción o sinopsis del manga
    generos: string[];        // Lista de géneros (e.g., ["Action", "Adventure"])
    capitulos: CapitulosResponse []
}

export interface CapitulosResponse {
    chapter_id: string; // ID del capítulo
    titulo: string;      // Título del capítulo

}
