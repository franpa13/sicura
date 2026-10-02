/** Metricas del dashboard: las consume el rol que solo mira numeros. */
export interface AdminMetrics {
  totalProductos: number;
  totalPedidos: number;
  totalCotizaciones: number;
  facturacionMes: number;
}
