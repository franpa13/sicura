import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, PageHeader } from '../../shared/components';
import { useAuth } from './useAuth';
import type { LoginCredentials } from './types';

interface RedirectState {
  from: string;
}

export function LoginPage() {
  const { loading, error, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const destino = (location.state as RedirectState | null)?.from ?? '/catalogo';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const exito = await login(credentials);
    if (exito) {
      navigate(destino, { replace: true });
    }
  }

  return (
    <section>
      <PageHeader title="Ingresar" subtitle="El registro es opcional: tambien podés comprar como invitado" />

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </section>
  );
}
