export interface AnimePerfilResponse {
    id: string;               // Identificador del anime
    titulo: string;           // Título del anime
    poster: string;           // URL del póster
    calificacion: string;     // Calificación promedio (e.g., "4.5")
    descripcion: string;      // Descripción o sinopsis del anime
    generos: string[];        // Lista de géneros (e.g., ["Accion", "Aventuras", "Fantasia"])
    votos_totales: string;    // Número total de votos (e.g., "549")
}
