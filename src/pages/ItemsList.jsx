import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [curatedAlbums, setCuratedAlbums] = useState([]);
  const [searchAlbums, setSearchAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialQuery);

  // 1. Cargar álbumes curados iniciales (solo si no hay búsqueda activa inicial)
  useEffect(() => {
    const loadCurated = async () => {
      // Si la URL ya tiene una búsqueda inicial, no saturamos cargando curados
      if (initialQuery) return;

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

        const shuffledAlbums = [...uniqueAlbums].sort(() => 0.5 - Math.random());

        setCuratedAlbums(shuffledAlbums);
      } catch (error) {
        console.error("Error al cargar los álbumes", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurated();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Debounce effect y persistencia en la URL
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      
      // Actualizamos la URL (con replace: true para no llenar el historial de letras sueltas)
      if (searchTerm.trim() !== '') {
        setSearchParams({ q: searchTerm }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
    }, 1000);

    return () => clearTimeout(timerId);
  }, [searchTerm, setSearchParams]);

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
          
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Busca álbumes, artistas, géneros..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
