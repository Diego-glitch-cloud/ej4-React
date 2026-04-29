import { useState, useEffect, useMemo, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlbumById } from '../services/itunesApi';
import { FavoritesContext } from '../contexts/FavoritesContext';
import './ItemDetail.css';

const QUOTES = [
  { text: "La música es el vino que inspira nuevas creaciones.", author: "Beethoven" },
  { text: "Sin música, la vida sería un error.", author: "Nietzsche" },
  { text: "Una cosa buena de la música, es que cuando te golpea, no sientes dolor.", author: "Bob Marley" },
  { text: "La música expresa aquello que no puede decirse y sobre lo que es imposible estar en silencio.", author: "Victor Hugo" },
  { text: "Donde las palabras fallan, la música habla.", author: "Hans Christian Andersen" },
  { text: "La música puede cambiar el mundo porque puede cambiar a las personas.", author: "Bono" },
  { text: "La música es música y sin música no habría música; por eso me gusta la música.", author: "Yo" },
];

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Integración de FavoritesContext
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const results = await fetchAlbumById(id);
        if (results && results.length > 0) {
          setAlbum(results[0]);
          setTracks(results.slice(1));
        }
      } catch (error) {
        console.error("Error al cargar detalles", error);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // Seleccionar una frase determinista basada en el ID del álbum
  const selectedQuote = useMemo(() => {
    if (!id) return QUOTES[0];
    const index = parseInt(id, 10) % QUOTES.length;
    return QUOTES[index];
  }, [id]);

  if (loading) return <div className="loader">Cargando disco...</div>;
  if (!album) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Álbum no encontrado</h2>
        <button onClick={() => navigate('/items')} className="btn-secondary">Volver al listado</button>
      </div>
    );
  }

  // Mejorar la calidad de la portada de forma segura
  const highResCover = album.artworkUrl100 ? album.artworkUrl100.replace('100x100bb', '600x600bb') : '';
  const year = album.releaseDate ? new Date(album.releaseDate).getFullYear() : '';
  const favorite = isFavorite(album.collectionId);

  return (
    <div className="item-detail-page">
      {/* Botón de regreso */}
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Volver
      </button>

      {/* Hero Section */}
      <div className="detail-hero">
        <div className="hero-content">
          <span className="hero-tag">{album.primaryGenreName}</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 className="hero-title" style={{ margin: 0 }}>{album.collectionName}</h1>
            <button 
              className={`favorite-btn ${favorite ? 'active' : ''}`}
              style={{ position: 'static', transform: 'none', background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', border: 'none', outline: 'none' }}
              onClick={() => toggleFavorite({ 
                id: album.collectionId, 
                title: album.collectionName, 
                artist: album.artistName, 
                coverUrl: album.artworkUrl100, 
                releaseDate: album.releaseDate 
              })}
              title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={favorite ? "var(--primary)" : "none"} stroke={favorite ? "var(--primary)" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <p className="hero-artist">Un álbum de <strong>{album.artistName}</strong></p>
          <div className="hero-metadata">
            <span>{year}</span>
            <span className="separator">•</span>
            <span>{album.trackCount} canciones</span>
          </div>
        </div>
        <div className="hero-image">
          <img src={highResCover} alt={`Portada de ${album.collectionName}`} />
        </div>
      </div>

      {/* Tracklist Section */}
      <div className="detail-content">
        <div className="tracklist-section">
          <h2 className="section-title">En Reproducción (Tracklist)</h2>
          <div className="tracklist">
            {tracks.map((track, index) => (
              <div key={track.trackId} className="track-item">
                <span className="track-number">{index + 1}</span>
                <div className="track-info">
                  <span className="track-name">{track.trackName}</span>
                  <span className="track-time">
                    {Math.floor(track.trackTimeMillis / 60000)}:
                    {((track.trackTimeMillis % 60000) / 1000).toFixed(0).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Block (Diseño Premium) */}
        <div className="quote-section">
          <div className="quote-block">
            <span className="quote-mark">“</span>
            <blockquote>
              {selectedQuote.text}
            </blockquote>
            <cite>— {selectedQuote.author}</cite>
          </div>
        </div>
      </div>
    </div>
  );
}
