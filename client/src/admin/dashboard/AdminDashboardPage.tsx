import { Card, PageHeader } from '../../shared/components';
import type { AdminMetrics } from './types';

// Pendiente: reemplazar por un endpoint de metricas del backend.
const METRICAS_VACIAS: AdminMetrics = {
  totalProductos: 0,
  totalPedidos: 0,
  totalCotizaciones: 0,
  facturacionMes: 0,
};

export function AdminDashboardPage() {
  const metrics: AdminMetrics = METRICAS_VACIAS;

  return (
    <section>
      <PageHeader title="Metricas" subtitle="Resumen de la operacion" />

      <div className="admin-metrics">
        <Card title="Productos">{metrics.totalProductos}</Card>
        <Card title="Pedidos">{metrics.totalPedidos}</Card>
        <Card title="Cotizaciones">{metrics.totalCotizaciones}</Card>
        <Card title="Facturacion del mes">{metrics.facturacionMes}</Card>
      </div>
    </section>
  );
}
