import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, PageHeader } from '../../shared/components';
import { formatPrecio } from '../../shared/utils';
import type { MedioPago } from '../../shared/types';
import { useCart } from '../cart';
import { useCheckout } from './useCheckout';
import type { CheckoutFormState } from './types';

const ESTADO_INICIAL: CheckoutFormState = {
  modo: 'invitado',
  medio_pago: 'mercado_pago',
  contacto: { nombre: '', email: '', telefono: '' },
};

const MEDIOS_PAGO: MedioPago[] = ['mercado_pago', 'transferencia', 'tarjeta'];

export function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const { loading, error, submit } = useCheckout();
  const [form, setForm] = useState<CheckoutFormState>(ESTADO_INICIAL);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const creada = await submit({
      items: lines.map((line) => ({ product_id: line.product.id, cantidad: line.cantidad })),
      medio_pago: form.medio_pago,
      contacto: form.contacto,
      user_id: form.modo === 'registrado' ? undefined : null,
    });

    if (creada) clear();
  }

  return (
    <section>
      <PageHeader title="Checkout" subtitle={`Total: ${formatPrecio(total)}`} />

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Como querés comprar</legend>
          <label>
            <input
              type="radio"
              name="modo"
              checked={form.modo === 'invitado'}
              onChange={() => setForm({ ...form, modo: 'invitado' })}
            />
            Como invitado
          </label>
          <label>
            <input
              type="radio"
              name="modo"
              checked={form.modo === 'registrado'}
              onChange={() => setForm({ ...form, modo: 'registrado' })}
            />
            Con mi cuenta
          </label>
        </fieldset>

        <label>
          Nombre
          <input
            value={form.contacto.nombre}
            onChange={(e) => setForm({ ...form, contacto: { ...form.contacto, nombre: e.target.value } })}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.contacto.email}
            onChange={(e) => setForm({ ...form, contacto: { ...form.contacto, email: e.target.value } })}
            required
          />
        </label>

        <label>
          WhatsApp
          <input
            value={form.contacto.telefono}
            onChange={(e) => setForm({ ...form, contacto: { ...form.contacto, telefono: e.target.value } })}
            required
          />
        </label>

        <label>
          Medio de pago
          <select
            value={form.medio_pago}
            onChange={(e) => setForm({ ...form, medio_pago: e.target.value as MedioPago })}
          >
            {MEDIOS_PAGO.map((medio) => (
              <option key={medio} value={medio}>
                {medio.replace('_', ' ')}
              </option>
            ))}
          </select>
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <Button type="submit" disabled={loading || lines.length === 0}>
          {loading ? 'Procesando...' : 'Confirmar compra'}
        </Button>
      </form>
    </section>
  );
}
