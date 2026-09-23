import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, PageHeader } from '../../shared/components';
import { useAuth } from './useAuth';
import type { LoginCredentials } from './types';

export function LoginPage() {
  const { loading, error, login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void login(credentials);
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
