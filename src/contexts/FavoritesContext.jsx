import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (album) => {
    setFavorites(prev => {
      // Si ya es favorito, lo quitamos
      if (prev.find(f => f.id === album.id)) {
        return prev.filter(f => f.id !== album.id);
      }
      // Si no es favorito, lo agregamos
      return [...prev, album];
    });
  };

  const isFavorite = (id) => favorites.some(f => f.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

FavoritesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
