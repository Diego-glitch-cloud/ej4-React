import { useParams, useNavigate } from 'react-router-dom';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="item-detail">
      <h2>Detalle del Álbum</h2>
      <p>ID del álbum: {id}</p>
      <button onClick={() => navigate(-1)} className="btn-secondary">Volver</button>
    </div>
  );
}
