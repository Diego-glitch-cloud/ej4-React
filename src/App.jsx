import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<ItemsList />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
