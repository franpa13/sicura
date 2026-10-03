import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './features/auth';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('No se encontro el elemento #root en index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
