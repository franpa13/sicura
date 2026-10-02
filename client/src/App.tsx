import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { publicRoutes } from './public/routes';
import { adminRoutes } from './admin/routes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes}
        {adminRoutes}
        <Route path="*" element={<p>Pagina no encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
