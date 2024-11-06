export interface ManwhaPerfilResponse {
    id: string;               // Identificador del manga (en minúsculas y con guiones)
    titulo: string;           // Título del manga
    portada: string;           // URL del póster
    calificacion: string;     // Calificación promedio (por ejemplo, "4.9")
    descripcion: string;      // Descripción o sinopsis del manga
    likes:string;
    visitas:string;
}


