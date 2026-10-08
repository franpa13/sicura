import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './shared/components';
import { CatalogPage, ProductDetailPage } from './features/catalog';
import { CartPage } from './features/cart';
import { CheckoutPage } from './features/checkout';
import { QuoteFormPage } from './features/quotes';
import { ADMIN_ROLES, LoginPage, ProtectedRoute, RegisterPage, SessionRedirect } from './features/auth';
import { AdminDashboardPage, AdminLayout, AdminProductsPage } from './features/admin';

export default function App() {
  return (
    <BrowserRouter>
      <SessionRedirect />
      <Routes>
        {/* Tienda publica */}
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/catalogo" replace />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="catalogo/:id" element={<ProductDetailPage />} />
          <Route path="carrito" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="cotizador" element={<QuoteFormPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
        </Route>

        {/* Panel administrativo */}
        <Route element={<ProtectedRoute roles={ADMIN_ROLES} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<p>Pagina no encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}
