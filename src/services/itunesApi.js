/**
 * Servicio para consumir la iTunes Search API
 * No requiere API Key.
 */

const BASE_URL = 'https://itunes.apple.com';

// Función auxiliar para buscar álbumes por término (ej: nombre de banda)
export const fetchAlbumsByTerm = async (term, limit = 5) => {
  try {
    // Usamos el endpoint de búsqueda limitando a la entidad "album"
    const response = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(term)}&entity=album&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    
    const data = await response.json();
    return data.results; // Array de álbumes
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
};

// Función para obtener detalles de un álbum específico por su ID
export const fetchAlbumById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/lookup?id=${id}&entity=song`);
    
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    
    const data = await response.json();
    return data.results; // El primer resultado es el álbum, los siguientes son canciones
  } catch (error) {
    console.error('Error fetching album details:', error);
    return [];
  }
};
