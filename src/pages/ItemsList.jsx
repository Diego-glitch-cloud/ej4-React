import { useState, useEffect } from 'react';
import { fetchAlbumsByTerm } from '../services/itunesApi';
import AlbumCard from '../components/AlbumCard';
import './ItemsList.css';

// Las bandas favoritas del usuario
const FAVORITE_BANDS = [
  'Geese', 'Metallica', 'Pink Floyd', 'The Strokes', 'Alice in Chains', 
  'The Smashing Pumpkins', 'Slowdive', 'My Bloody Valentine', 'Rush', 
  'The Smiths', 'Deftones', 'Radiohead', 'Black Sabbath', 'Soundgarden', 
  'Tool', 'Avenged Sevenfold', 'American Football', 'Title Fight', 
  'Candelabro', 'Black Country, New Road', 'Cocteau Twins', 'Deafheaven', 
  'The Cure', 'Nirvana', 'Sweet Trip', 'Death Grips', 'Jeff Buckley', 
  'Portishead', 'The Cranberries', 'Alvvays'
];

export default function ItemsList() {
  const [curatedAlbums, setCuratedAlbums] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 1. Cargar álbumes curados iniciales
  useEffect(() => {
    const loadCurated = async () => {
      setLoading(true);
      try {
        const shuffledBands = [...FAVORITE_BANDS].sort(() => 0.5 - Math.random());
        const selectedBands = shuffledBands.slice(0, 12);

        const promises = selectedBands.map(band => fetchAlbumsByTerm(band, 6));
        const results = await Promise.all(promises);
        
        const allAlbums = results.flat();
        
        const uniqueAlbums = allAlbums.filter((album, index, self) => {
          const isDuplicate = index !== self.findIndex((a) => a.collectionId === album.collectionId);
          if (isDuplicate) return false;
          return selectedBands.some(band => 
            album.artistName.toLowerCase().includes(band.toLowerCase())
          );
        });

        setCuratedAlbums(uniqueAlbums);
      } catch (error) {
        console.error("Error al cargar los álbumes", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurated();
  }, []);

  // 2. Debounce effect (retraso de 1 segundo)
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // 3. Efecto de búsqueda directa en la API
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchAlbums([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        const results = await fetchAlbumsByTerm(debouncedSearchTerm, 20);
        // Filtrar duplicados pero sin restringir el artista para permitir buscar CUALQUIER cosa
        const uniqueAlbums = results.filter((album, index, self) =>
          index === self.findIndex((a) => a.collectionId === album.collectionId)
        );
        setSearchAlbums(uniqueAlbums);
      } catch (error) {
        console.error("Error buscando en la API", error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const isSearching = debouncedSearchTerm.trim().length > 0;
  const displayedAlbums = isSearching ? searchAlbums : curatedAlbums;

  return (
    <div className="items-list-page" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">
        <header className="page-header">
          <h1>Explorar Álbumes</h1>
          <p>Una selección curada de nuestras bandas favoritas.</p>
          
          <input 
            type="text" 
            className="search-input" 
            placeholder="Buscar por álbum o banda..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </header>

        {loading ? (
          <div className="loader">Cargando la mejor música...</div>
        ) : (
          <div className="albums-grid">
            {displayedAlbums.length > 0 ? (
              displayedAlbums.map((album) => (
                <AlbumCard
                  key={album.collectionId}
                  id={album.collectionId}
                  title={album.collectionName}
                  artist={album.artistName}
                  coverUrl={album.artworkUrl100}
                  releaseDate={album.releaseDate}
                />
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No se encontraron álbumes en la búsqueda global para "{searchTerm}".
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
