const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
});

/** Los precios llegan del backend como string (DECIMAL de MySQL). */
export function formatPrecio(precio: string | number): string {
  const valor = typeof precio === 'string' ? Number.parseFloat(precio) : precio;
  if (Number.isNaN(valor)) return '-';
  return currencyFormatter.format(valor);
}

export function formatFecha(fecha: string | undefined): string {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-AR');
}
