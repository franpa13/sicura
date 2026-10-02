import { Navigate, Route } from 'react-router-dom';
import { PublicLayout } from './layout';
import { CatalogPage, ProductDetailPage } from './catalog';
import { CartPage } from './cart';
import { CheckoutPage } from './checkout';
import { QuoteFormPage } from './quotes';
import { LoginPage, RegisterPage } from '../auth';

/** Rutas de la tienda publica. Se montan en App.tsx. */
export const publicRoutes = (
  <Route element={<PublicLayout />}>
    <Route index element={<Navigate to="/catalogo" replace />} />
    <Route path="catalogo" element={<CatalogPage />} />
    <Route path="catalogo/:id" element={<ProductDetailPage />} />
    <Route path="carrito" element={<CartPage />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="cotizador" element={<QuoteFormPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="registro" element={<RegisterPage />} />
  </Route>
);
