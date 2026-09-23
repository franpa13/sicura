export type QuoteEstado = 'nueva' | 'en_contacto' | 'presupuestada' | 'ganada' | 'perdida';

export interface Quote {
  id: number;
  nombre_empresa: string;
  contacto: string;
  detalle_servicio: string;
  estado: QuoteEstado;
  createdAt?: string;
  updatedAt?: string;
}

/** Lo que envia el formulario del cotizador de empresas. */
export interface QuoteInput {
  nombre_empresa: string;
  contacto: string;
  detalle_servicio: string;
}
