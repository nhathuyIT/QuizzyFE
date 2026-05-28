type Primitive = string | number | boolean | null | undefined;

type StorageValue = Primitive | Record<string, Primitive> | Primitive[];

function serialize(value: StorageValue): string {
  return JSON.stringify(value);
}

function deserialize<T>(value: string | null): T | null {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}

export const storage = {
  get<T extends StorageValue>(key: string): T | null {
    if (typeof window === "undefined") return null;
    return deserialize<T>(localStorage.getItem(key));
  },

  set(key: string, value: StorageValue): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, serialize(value));
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },

  has(key: string): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) !== null;
  },
};

export const session = {
  get<T extends StorageValue>(key: string): T | null {
    if (typeof window === "undefined") return null;
    return deserialize<T>(sessionStorage.getItem(key));
  },

  set(key: string, value: StorageValue): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, serialize(value));
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  },
};
