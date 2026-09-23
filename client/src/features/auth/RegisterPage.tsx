import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, PageHeader } from '../../shared/components';
import type { UserTipo } from '../../shared/types';
import { useAuth } from './useAuth';
import type { RegisterInput } from './types';

const ESTADO_INICIAL: RegisterInput = {
  nombre: '',
  email: '',
  password: '',
  tipo: 'persona',
};

export function RegisterPage() {
  const { loading, error, register } = useAuth();
  const [form, setForm] = useState<RegisterInput>(ESTADO_INICIAL);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void register(form);
  }

  return (
    <section>
      <PageHeader title="Crear cuenta" />

      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>

        <label>
          Tipo de cliente
          <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as UserTipo })}>
            <option value="persona">Particular</option>
            <option value="empresa">Empresa</option>
          </select>
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
    </section>
  );
}
