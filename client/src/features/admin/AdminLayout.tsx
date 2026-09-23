import { Link, Outlet } from 'react-router-dom';

/** Layout del panel administrativo, separado del layout publico de la tienda. */
export function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <h2>Panel SICURA</h2>
        <nav>
          <Link to="/admin">Metricas</Link>
          <Link to="/admin/productos">Productos</Link>
          <Link to="/">Volver a la tienda</Link>
        </nav>
      </aside>

      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
