import { useState, useEffect } from 'react';
import { fetchAlbumsByTerm } from '../services/itunesApi';
import AlbumCard from '../components/AlbumCard';
import './ItemsList.css';

// Las bandas favoritas del usuario
const FAVORITE_BANDS = [
  'Radiohead', 'The Strokes', 'Pink Floyd', 'Metallica', 
  'Slowdive', 'My Bloody Valentine', 'Black Country, New Road'
];

export default function ItemsList() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlbums = async () => {
      setLoading(true);
      try {
        // Obtenemos 6 álbumes de cada banda
        const promises = FAVORITE_BANDS.map(band => fetchAlbumsByTerm(band, 6));
        const results = await Promise.all(promises);
        
        const allAlbums = results.flat();
        
        // Filtramos para evitar duplicados y asegurarnos de que el artista coincida con la banda
        // Esto elimina resultados irrelevantes como mgk o artistas secundarios
        const uniqueAlbums = allAlbums.filter((album, index, self) => {
          const isDuplicate = index !== self.findIndex((a) => a.collectionId === album.collectionId);
          if (isDuplicate) return false;

          const artistMatch = FAVORITE_BANDS.some(band => 
            album.artistName.toLowerCase().includes(band.toLowerCase())
          );
          
          return artistMatch;
        });

        setAlbums(uniqueAlbums);
      } catch (error) {
        console.error("Error al cargar los álbumes", error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbums();
  }, []);

  return (
    <div className="items-list-page light-section" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">
        <header className="page-header">
          <h1>Explorar Álbumes</h1>
          <p>Una selección curada de nuestras bandas favoritas.</p>
        </header>

        {loading ? (
          <div className="loader">Cargando la mejor música...</div>
        ) : (
          <div className="albums-grid">
            {albums.map((album) => (
              <AlbumCard
                key={album.collectionId}
                id={album.collectionId}
                title={album.collectionName}
                artist={album.artistName}
                coverUrl={album.artworkUrl100}
                releaseDate={album.releaseDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
