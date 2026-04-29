import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';
import './AlbumCard.css';

export default function AlbumCard({ id, title, artist, coverUrl, releaseDate }) {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(id);
  // Extraer el año de la fecha de lanzamiento (ej: "1997-05-21T07:00:00Z" -> "1997")
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  // Mejorar calidad de la imagen de forma segura
  const highResCover = coverUrl ? coverUrl.replace('100x100bb', '400x400bb') : '';

  return (
    <div className="album-card">
      <div className="album-card-image">
        {/* Cambiamos el 100x100 por 400x400 para mejor calidad */}
        <img src={highResCover} alt={`Portada de ${title}`} loading="lazy" />
        <div className="album-card-overlay">
          <Link to={`/items/${id}`} className="view-btn">Ver Detalles</Link>
          {/* Botón de favorito usando el contexto */}
          <button 
            className={`favorite-btn ${favorite ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault(); // Evita que se navegue al hacer clic en el botón
              toggleFavorite({ id, title, artist, coverUrl, releaseDate });
            }}
            title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={favorite ? "var(--primary)" : "none"} stroke={favorite ? "var(--primary)" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="album-card-content">
        <span className="album-year">{year}</span>
        <h3 className="album-title">
          <Link to={`/items/${id}`}>{title}</Link>
        </h3>
        <p className="album-artist">{artist}</p>
      </div>
    </div>
  );
}

// Requerimiento Senior: Uso de PropTypes documentado
AlbumCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  coverUrl: PropTypes.string.isRequired,
  releaseDate: PropTypes.string,
};
