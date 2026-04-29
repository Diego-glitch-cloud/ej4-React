import { useContext } from 'react';
import { FavoritesContext } from '../contexts/FavoritesContext';
import AlbumCard from '../components/AlbumCard';
import './ItemsList.css'; // Reusamos los estilos de la grid

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="items-list-page" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">
        <header className="page-header">
          <h1>Mis Favoritos</h1>
          <p>Tu colección personal de discos de culto.</p>
        </header>

        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Aún no tienes álbumes favoritos.</p>
            <p>Explora el catálogo y usa el corazón (🤍) en las portadas para guardarlos aquí.</p>
          </div>
        ) : (
          <div className="albums-grid">
            {favorites.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                title={album.title}
                artist={album.artist}
                coverUrl={album.coverUrl}
                releaseDate={album.releaseDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
