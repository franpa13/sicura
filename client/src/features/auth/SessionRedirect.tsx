import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onSessionExpired } from '../../shared/services';

/**
 * Navega al login cuando la sesion se cae. Vive dentro del BrowserRouter porque
 * useNavigate no funciona fuera, y AuthProvider esta montado por encima de App.
 */
export function SessionRedirect() {
  const navigate = useNavigate();

  useEffect(() => onSessionExpired(() => navigate('/login', { replace: true })), [navigate]);

  return null;
}