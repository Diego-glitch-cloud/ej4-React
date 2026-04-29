import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAlbumsByTerm } from '../services/itunesApi';
import AlbumCard from '../components/AlbumCard';
import './Home.css';

export default function Home() {
  const [heroAlbum, setHeroAlbum] = useState(null);
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Hero: Radiohead In Rainbows
        const radiohead = await fetchAlbumsByTerm('Radiohead In Rainbows', 1);
        if (radiohead.length) setHeroAlbum(radiohead[0]);

        // Destacados
        const mbv = await fetchAlbumsByTerm('My Bloody Valentine Loveless', 1);
        const bowie = await fetchAlbumsByTerm('David Bowie Ziggy Stardust', 1);
        const joyDivision = await fetchAlbumsByTerm('Joy Division Unknown Pleasures', 1);

        setFeatured([...mbv, ...bowie, ...joyDivision]);
      } catch (error) {
        console.error("Error cargando el inicio", error);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION (DARK RED) */}
      {heroAlbum && (
        <section className="home-hero">
          <div
            className="hero-bg-image"
            style={{ backgroundImage: `url(${heroAlbum.artworkUrl100.replace('100x100bb', '1000x1000bb')})` }}
          ></div>
          <div className="hero-gradient"></div>
          <div className="container hero-content">
            <span className="hero-tag">Álbum Destacado</span>
            <h1 className="hero-title">El legado eterno de {heroAlbum.artistName}</h1>
            <p className="hero-subtitle">A años de su formación, revisitamos la discografía de una de las bandas más influyentes de nuestra era.</p>
            <button className="btn-primary hero-btn" onClick={() => navigate(`/items/${heroAlbum.collectionId}`)}>
              Ver Álbum →
            </button>
          </div>
        </section>
      )}

      {/* ARTÍCULOS DESTACADOS SECTION (LIGHT) */}
      <section className="home-section light-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Artículos Destacados</h2>
            <Link to="/items" className="view-all">Ver Todos</Link>
          </div>
          <div className="featured-grid">
            {featured.map(album => (
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
        </div>
      </section>

      {/* EN REPRODUCCIÓN / QUOTE SECTION (DARK) */}
      <section className="home-section dark-section playlist-quote-section">
        <div className="container split-layout">
          <div className="playlist-area">
            <h3 className="area-title">En Reproducción</h3>
            <p className="area-subtitle">Nuestras recomendaciones semanales.</p>

            {/* Mock Playlist Items */}
            <div className="mini-track">
              <img src="https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4b/5e/5c/4b5e5c3e-9086-444f-c4f4-5f2129eb4945/14UMGIM07662.rgb.jpg/100x100bb.jpg" alt="Enjoy the silence" />
              <div className="mini-track-info">
                <strong>Depeche Mode</strong>
                <span>Enjoy the Silence</span>
              </div>
            </div>
            <div className="mini-track">
              <img src="https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ba/6d/f8/ba6df85c-482a-e6ba-f96d-f45812e96417/00724384407021.rgb.jpg/100x100bb.jpg" alt="Teardrop" />
              <div className="mini-track-info">
                <strong>Massive Attack</strong>
                <span>Teardrop</span>
              </div>
            </div>
            <div className="mini-track">
              <img src="https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/36/f2/ec36f23e-6380-57eb-30ba-ba1d51abf3d1/00042282860020.rgb.jpg/100x100bb.jpg" alt="Roads" />
              <div className="mini-track-info">
                <strong>Portishead</strong>
                <span>Roads</span>
              </div>
            </div>

            <Link to="/items" className="btn-secondary full-width">Explorar más</Link>
          </div>

          <div className="quote-area">
            <div className="quote-content">
              <span className="quote-icon">“</span>
              <blockquote>
                La música puede cambiar el mundo porque puede cambiar a las personas.
              </blockquote>
              <cite>— Bono</cite>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
