import { useMemo } from 'react';
import { useLocalStorage } from '../../shared/hooks';
import type { Product } from '../../shared/types';
import type { CartLine } from './types';

const CART_STORAGE_KEY = 'sicura.cart';

/** Carrito persistido en localStorage: funciona igual para invitado y registrado. */
export function useCart() {
  const [lines, setLines] = useLocalStorage<CartLine[]>(CART_STORAGE_KEY, []);

  const total = useMemo(
    () => lines.reduce((acc, line) => acc + Number.parseFloat(line.product.precio) * line.cantidad, 0),
    [lines]
  );

  function addProduct(product: Product, cantidad = 1) {
    const existente = lines.find((line) => line.product.id === product.id);
    if (existente) {
      setLines(
        lines.map((line) =>
          line.product.id === product.id ? { ...line, cantidad: line.cantidad + cantidad } : line
        )
      );
      return;
    }
    setLines([...lines, { product, cantidad }]);
  }

  function updateCantidad(productId: number, cantidad: number) {
    if (cantidad <= 0) {
      removeProduct(productId);
      return;
    }
    setLines(lines.map((line) => (line.product.id === productId ? { ...line, cantidad } : line)));
  }

  function removeProduct(productId: number) {
    setLines(lines.filter((line) => line.product.id !== productId));
  }

  function clear() {
    setLines([]);
  }

  return { lines, total, addProduct, updateCantidad, removeProduct, clear };
}
