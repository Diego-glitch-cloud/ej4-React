import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './AlbumCard.css';

export default function AlbumCard({ id, title, artist, coverUrl, releaseDate }) {
  // Extraer el año de la fecha de lanzamiento (ej: "1997-05-21T07:00:00Z" -> "1997")
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <div className="album-card">
      <div className="album-card-image">
        {/* Cambiamos el 100x100 por 400x400 para mejor calidad */}
        <img src={coverUrl.replace('100x100bb', '400x400bb')} alt={`Portada de ${title}`} loading="lazy" />
        <div className="album-card-overlay">
          <Link to={`/items/${id}`} className="view-btn">Ver Detalles</Link>
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
