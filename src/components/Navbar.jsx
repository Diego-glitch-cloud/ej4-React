import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAlbumsByTerm } from '../services/itunesApi';
import { ThemeContext } from '../contexts/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleRandomAlbum = async () => {
    // Array de bandas de culto para el botón sorpresa
    const bands = ['Radiohead', 'The Strokes', 'Pink Floyd', 'Metallica', 'Slowdive', 'My Bloody Valentine', 'Deftones'];
    const randomBand = bands[Math.floor(Math.random() * bands.length)];
    
    try {
      const albums = await fetchAlbumsByTerm(randomBand, 10);
      
      // Filtramos estrictamente por el nombre del artista para evitar resultados como "mgk - bloody valentine"
      const filteredAlbums = albums.filter(album => 
        album.artistName.toLowerCase().includes(randomBand.toLowerCase())
      );

      if (filteredAlbums.length > 0) {
        const randomAlbum = filteredAlbums[Math.floor(Math.random() * filteredAlbums.length)];
        navigate(`/items/${randomAlbum.collectionId}`);
      }
    } catch (error) {
      console.error("Error buscando álbum aleatorio", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MusicBlog</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/items">Álbumes</Link></li>
        <li>
          <button onClick={handleRandomAlbum} className="btn-random">
            Aleatorio
          </button>
        </li>
        <li>
          <button onClick={toggleTheme} className="btn-random" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {theme === 'dark' ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                Claro
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                Oscuro
              </>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}
