import { beforeEach, describe, expect, it } from "vitest";
import type { User } from "../../domain/entities";
import { LocalUserRepository } from "./LocalUserRepository";

function makeUser(): User {
  return {
    id: "user-1",
    username: "johndoe",
    name: "John Doe",
    passwordHash: "abc123hash",
    role: "user",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  };
}

describe("LocalUserRepository", () => {
  let repo: LocalUserRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalUserRepository();
  });

  it("deve criar e listar usuários", async () => {
    await repo.create(makeUser());

    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].username).toBe("johndoe");
  });

  it("deve buscar usuário por id", async () => {
    await repo.create(makeUser());

    const found = await repo.findById("user-1");
    expect(found).not.toBeNull();
    expect(found!.name).toBe("John Doe");
  });

  it("deve buscar usuário por username", async () => {
    await repo.create(makeUser());

    const found = await repo.findByUsername("johndoe");
    expect(found).not.toBeNull();
    expect(found!.id).toBe("user-1");
  });

  it("deve retornar null para username inexistente", async () => {
    const found = await repo.findByUsername("naoexiste");
    expect(found).toBeNull();
  });

  it("deve atualizar usuário", async () => {
    await repo.create(makeUser());

    const updated = await repo.update("user-1", { name: "Jane Doe" });
    expect(updated.name).toBe("Jane Doe");
    expect(updated.username).toBe("johndoe");
  });

  it("deve deletar usuário", async () => {
    await repo.create(makeUser());
    await repo.delete("user-1");

    const all = await repo.findAll();
    expect(all).toHaveLength(0);
  });

  it("deve verificar se está vazio", async () => {
    expect(await repo.isEmpty()).toBe(true);

    await repo.create(makeUser());
    expect(await repo.isEmpty()).toBe(false);
  });
});
