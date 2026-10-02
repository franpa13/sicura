import { Route } from 'react-router-dom';
import { AdminLayout } from './layout';
import { AdminDashboardPage } from './dashboard';
import { AdminProductsPage } from './products';

/**
 * Rutas del panel interno. Se montan en App.tsx.
 * Pendiente: envolver en ProtectedRoute cuando este lista la sesion (SIC-35).
 */
export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboardPage />} />
    <Route path="productos" element={<AdminProductsPage />} />
  </Route>
);
