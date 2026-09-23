import { useCallback, useState } from 'react';

/** Estado persistido en localStorage, tipado. Se usa para carrito y segmento. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Modo privado o storage lleno: se sigue usando el valor en memoria.
      }
    },
    [key]
  );

  return [value, update] as const;
}
