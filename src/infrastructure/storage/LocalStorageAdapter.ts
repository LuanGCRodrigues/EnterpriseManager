const SIMULATED_DELAY_MS = 200;

/**
 * Simula delay de rede
 */
function simulateNetworkDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
}

/**
 * Adaptador genérico para persistência no localStorage
 * simula operações assíncronas como se fosse uma API REST.
 */
export class LocalStorageAdapter<T extends { id: string }> {
  private readonly storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  private getAll(): T[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  private saveAll(items: T[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  async findAll(): Promise<T[]> {
    await simulateNetworkDelay();
    return this.getAll();
  }

  async findById(id: string): Promise<T | null> {
    await simulateNetworkDelay();
    const items = this.getAll();
    return items.find((item) => item.id === id) ?? null;
  }

  async findBy(predicate: (item: T) => boolean): Promise<T | null> {
    await simulateNetworkDelay();
    const items = this.getAll();
    return items.find(predicate) ?? null;
  }

  async create(item: T): Promise<T> {
    await simulateNetworkDelay();
    const items = this.getAll();
    items.push(item);
    this.saveAll(items);
    return item;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await simulateNetworkDelay();
    const items = this.getAll();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Item com id "${id}" não encontrado.`);
    }

    items[index] = { ...items[index], ...data };
    this.saveAll(items);
    return items[index];
  }

  async delete(id: string): Promise<void> {
    await simulateNetworkDelay();
    const items = this.getAll();
    const filtered = items.filter((item) => item.id !== id);

    if (filtered.length === items.length) {
      throw new Error(`Item com id "${id}" não encontrado.`);
    }

    this.saveAll(filtered);
  }

  /**
   * Verifica se já existem dados inicializados para a colection
   * que foi utilizada para instanciar o adapter.
   */
  async isEmpty(): Promise<boolean> {
    const items = this.getAll();
    return items.length === 0;
  }
}
