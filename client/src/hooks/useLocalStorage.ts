import { useCallback, useState } from 'react';

/** Dùng chung với api client (Bearer) — phải khớp khóa localStorage. */
export function finmindStorageKey(key: string) {
  return `finmind:${key}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(finmindStorageKey(key));
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValueState] = useState<T>(() => read(key, initial));

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          localStorage.setItem(finmindStorageKey(key), JSON.stringify(resolved));
        } catch {
          /* quota / private mode */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setValue] as const;
}
