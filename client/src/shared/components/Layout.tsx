import { Link, Outlet } from 'react-router-dom';
import { tieneAccesoAdmin, useAuth } from '../../features/auth';

/** Layout publico de la tienda: header, contenido de la ruta y footer. */
export function Layout() {
  const { user } = useAuth();
  const muestraPanel = user !== null && tieneAccesoAdmin(user.rol);

  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__brand">
          SICURA
        </Link>
        <nav className="layout__nav">
          <Link to="/catalogo">Catalogo</Link>
          <Link to="/cotizador">Cotizador empresas</Link>
          <Link to="/carrito">Carrito</Link>
          {muestraPanel ? <Link to="/admin">Panel</Link> : null}
          <Link to="/login">Ingresar</Link>
        </nav>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <footer className="layout__footer">
        <small>SICURA - Vigilancia fisica, seguridad electronica y productos ADT</small>
      </footer>
    </div>
  );
}
