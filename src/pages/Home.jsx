import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home">
      <h1>Bienvenido a tu Blog de Música</h1>
      <p>Explora la mejor música, artistas y álbumes de tus bandas favoritas.</p>
      <Link to="/items" className="btn-primary">Explorar Álbumes</Link>
    </div>
  );
}
