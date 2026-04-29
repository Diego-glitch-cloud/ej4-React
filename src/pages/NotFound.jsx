import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h2>404 - Página no encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="btn-primary">Volver al inicio</Link>
    </div>
  );
}
