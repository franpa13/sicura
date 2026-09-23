import { Button } from '../../shared/components';
import type { Segmento } from './types';

interface SegmentoSelectorProps {
  segmento: Segmento;
  onChange: (segmento: Segmento) => void;
}

/** Segmentacion persona / empresa al entrar a la tienda. */
export function SegmentoSelector({ segmento, onChange }: SegmentoSelectorProps) {
  return (
    <div className="segmento-selector">
      <Button
        variant={segmento === 'persona' ? 'primary' : 'ghost'}
        onClick={() => onChange('persona')}
      >
        Soy particular
      </Button>
      <Button
        variant={segmento === 'empresa' ? 'primary' : 'ghost'}
        onClick={() => onChange('empresa')}
      >
        Soy empresa
      </Button>
    </div>
  );
}
