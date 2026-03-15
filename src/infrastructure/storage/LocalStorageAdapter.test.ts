import { describe, it, expect, beforeEach } from "vitest";
import { LocalStorageAdapter } from "./LocalStorageAdapter";

interface TestItem {
  id: string;
  name: string;
  value: number;
}

describe("LocalStorageAdapter", () => {
  const STORAGE_KEY = "test_adapter";
  let adapter: LocalStorageAdapter<TestItem>;

  beforeEach(() => {
    localStorage.clear();
    adapter = new LocalStorageAdapter<TestItem>(STORAGE_KEY);
  });

  describe("findAll", () => {
    it("deve retornar array vazio quando não há dados", async () => {
      const items = await adapter.findAll();
      expect(items).toEqual([]);
    });

    it("deve retornar todos os itens armazenados", async () => {
      const item1: TestItem = { id: "1", name: "Item 1", value: 10 };
      const item2: TestItem = { id: "2", name: "Item 2", value: 20 };
      await adapter.create(item1);
      await adapter.create(item2);

      const items = await adapter.findAll();
      expect(items).toHaveLength(2);
      expect(items).toEqual([item1, item2]);
    });
  });

  describe("findById", () => {
    it("deve retornar null quando o item não existe", async () => {
      const item = await adapter.findById("inexistente");
      expect(item).toBeNull();
    });

    it("deve retornar o item quando existe", async () => {
      const item: TestItem = { id: "1", name: "Item 1", value: 10 };
      await adapter.create(item);

      const found = await adapter.findById("1");
      expect(found).toEqual(item);
    });
  });

  describe("findBy", () => {
    it("deve retornar null quando nenhum item satisfaz o predicado", async () => {
      await adapter.create({ id: "1", name: "A", value: 10 });
      const found = await adapter.findBy((item) => item.name === "Z");
      expect(found).toBeNull();
    });

    it("deve retornar o primeiro item que satisfaz o predicado", async () => {
      await adapter.create({ id: "1", name: "A", value: 10 });
      await adapter.create({ id: "2", name: "B", value: 20 });

      const found = await adapter.findBy((item) => item.value > 15);
      expect(found).toEqual({ id: "2", name: "B", value: 20 });
    });
  });

  describe("create", () => {
    it("deve criar e retornar o item", async () => {
      const item: TestItem = { id: "1", name: "Novo", value: 42 };
      const created = await adapter.create(item);

      expect(created).toEqual(item);
    });

    it("deve persistir o item no localStorage", async () => {
      const item: TestItem = { id: "1", name: "Novo", value: 42 };
      await adapter.create(item);

      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw!)).toEqual([item]);
    });
  });

  describe("update", () => {
    it("deve atualizar parcialmente o item", async () => {
      await adapter.create({ id: "1", name: "Original", value: 10 });

      const updated = await adapter.update("1", { name: "Atualizado" });
      expect(updated.name).toBe("Atualizado");
      expect(updated.value).toBe(10);
    });

    it("deve lançar erro ao atualizar item inexistente", async () => {
      await expect(
        adapter.update("inexistente", { name: "X" }),
      ).rejects.toThrow('Item com id "inexistente" não encontrado.');
    });
  });

  describe("delete", () => {
    it("deve remover o item", async () => {
      await adapter.create({ id: "1", name: "A", value: 10 });
      await adapter.delete("1");

      const items = await adapter.findAll();
      expect(items).toHaveLength(0);
    });

    it("deve lançar erro ao deletar item inexistente", async () => {
      await expect(adapter.delete("inexistente")).rejects.toThrow(
        'Item com id "inexistente" não encontrado.',
      );
    });
  });

  describe("isEmpty", () => {
    it("deve retornar true quando não há itens", async () => {
      expect(await adapter.isEmpty()).toBe(true);
    });

    it("deve retornar false quando há itens", async () => {
      await adapter.create({ id: "1", name: "A", value: 10 });
      expect(await adapter.isEmpty()).toBe(false);
    });
  });
});
