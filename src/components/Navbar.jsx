import { Link, useNavigate } from 'react-router-dom';
import { fetchAlbumsByTerm } from '../services/itunesApi';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  const handleRandomAlbum = async () => {
    // Array de bandas de culto para el botón sorpresa
    const bands = ['Radiohead', 'The Strokes', 'Pink Floyd', 'Metallica', 'Slowdive', 'My Bloody Valentine', 'Deftones'];
    const randomBand = bands[Math.floor(Math.random() * bands.length)];
    
    try {
      const albums = await fetchAlbumsByTerm(randomBand, 10);
      if (albums.length > 0) {
        const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
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
      </ul>
    </nav>
  );
}
