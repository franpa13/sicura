import { Button } from '../../shared/components';
import { formatPrecio } from '../../shared/utils';
import type { CartLine } from './types';

interface CartLineRowProps {
  line: CartLine;
  onCantidadChange: (productId: number, cantidad: number) => void;
  onRemove: (productId: number) => void;
}

export function CartLineRow({ line, onCantidadChange, onRemove }: CartLineRowProps) {
  return (
    <tr>
      <td>{line.product.nombre}</td>
      <td>{formatPrecio(line.product.precio)}</td>
      <td>
        <input
          type="number"
          min={1}
          value={line.cantidad}
          onChange={(event) => onCantidadChange(line.product.id, Number(event.target.value))}
        />
      </td>
      <td>
        <Button variant="ghost" onClick={() => onRemove(line.product.id)}>
          Quitar
        </Button>
      </td>
    </tr>
  );
}
