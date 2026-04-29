import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAlbumById } from '../services/itunesApi';
import './ItemDetail.css';

const MUSIC_QUOTES = [
  { text: "La música puede cambiar el mundo porque puede cambiar a las personas.", author: "Bono" },
  { text: "Una cosa buena de la música, es que cuando te golpea, no sientes dolor.", author: "Bob Marley" },
  { text: "Sin música, la vida sería un error.", author: "Friedrich Nietzsche" },
  { text: "La música expresa lo que no puede ser dicho y aquello sobre lo que es imposible permanecer en silencio.", author: "Victor Hugo" },
  { text: "Donde las palabras fallan, la música habla.", author: "Hans Christian Andersen" },
  { text: "La música es el lenguaje universal de la humanidad.", author: "Henry Wadsworth Longfellow" },
  { text: "La música es el arte más directo, entra por el oído y va al corazón.", author: "Magdalena Martínez" }
];

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [albumData, setAlbumData] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Elegir una frase basada en el ID del álbum (para que siempre sea la misma para un álbum específico)
  const albumQuote = useMemo(() => {
    const seed = parseInt(id) || 0;
    return MUSIC_QUOTES[seed % MUSIC_QUOTES.length];
  }, [id]);

  useEffect(() => {
    const getAlbumDetails = async () => {
      setLoading(true);
      try {
        const results = await fetchAlbumById(id);
        if (results && results.length > 0) {
          // El primer resultado es la información del álbum
          setAlbumData(results[0]);
          // Los resultados restantes son las canciones
          setTracks(results.slice(1));
        }
      } catch (error) {
        console.error('Error fetching album details:', error);
      } finally {
        setLoading(false);
      }
    };

    getAlbumDetails();
  }, [id]);

  if (loading) {
    return <div className="loader">Cargando detalles del álbum...</div>;
  }

  if (!albumData) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Álbum no encontrado</h2>
        <button onClick={() => navigate('/items')} className="btn-secondary">Volver al listado</button>
      </div>
    );
  }

  // Mejorar la calidad de la portada (de 100x100 a 600x600)
  const highResCover = albumData.artworkUrl100.replace('100x100bb', '600x600bb');
  const year = new Date(albumData.releaseDate).getFullYear();

  return (
    <div className="item-detail-page">
      {/* Botón de regreso */}
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Volver
      </button>

      {/* Hero Section */}
      <div className="detail-hero">
        <div className="hero-content">
          <span className="hero-tag">{albumData.primaryGenreName}</span>
          <h1 className="hero-title">{albumData.collectionName}</h1>
          <p className="hero-artist">Un álbum de <strong>{albumData.artistName}</strong></p>
          <div className="hero-metadata">
            <span>{year}</span>
            <span className="separator">•</span>
            <span>{albumData.trackCount} canciones</span>
          </div>
        </div>
        <div className="hero-image">
          <img src={highResCover} alt={`Portada de ${albumData.collectionName}`} />
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
              {albumQuote.text}
            </blockquote>
            <cite>— {albumQuote.author}</cite>
          </div>
        </div>
      </div>
    </div>
  );
}
