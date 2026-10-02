import type { FormEvent } from 'react';
import { Button, PageHeader } from '../../shared/components';
import { useQuoteForm } from './useQuoteForm';

export function QuoteFormPage() {
  const { form, loading, error, enviada, updateField, submit } = useQuoteForm();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit();
  }

  return (
    <section>
      <PageHeader
        title="Cotizador para empresas"
        subtitle="Contanos que necesitás y un asesor comercial se contacta con vos"
      />

      {enviada ? <p>Recibimos tu consulta. Te vamos a contactar a la brevedad.</p> : null}

      <form onSubmit={handleSubmit}>
        <label>
          Empresa
          <input
            value={form.nombre_empresa}
            onChange={(e) => updateField('nombre_empresa', e.target.value)}
            required
          />
        </label>

        <label>
          Contacto (mail o telefono)
          <input
            value={form.contacto}
            onChange={(e) => updateField('contacto', e.target.value)}
            required
          />
        </label>

        <label>
          Servicio que necesitás
          <textarea
            value={form.detalle_servicio}
            onChange={(e) => updateField('detalle_servicio', e.target.value)}
            rows={5}
            required
          />
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Solicitar cotizacion'}
        </Button>
      </form>
    </section>
  );
}
