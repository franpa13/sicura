import { useLocalStorage } from '../../shared/hooks';
import type { Segmento } from './types';

/** Persiste si el visitante entro como persona o como empresa. */
export function useSegmento() {
  const [segmento, setSegmento] = useLocalStorage<Segmento>('sicura.segmento', 'persona');
  return { segmento, setSegmento };
}
