import { beforeEach, describe, expect, it } from "vitest";
import type { Enterprise } from "../../domain/entities";
import { LocalEnterpriseRepository } from "./LocalEnterpriseRepository";

function makeEnterprise(): Enterprise {
  return {
    id: "ent-1",
    name: "NC1",
    owner: "João Silva",
    email: "joao@nc1.com",
    phone: "(48) 99999-0001",
    description: "Uma empresa de tecnologia",
    sector: "Tecnologia",
    city: "Florianópolis",
    state: "SC",
    foundedAt: "2023-01-01",
    employees: 10,
    revenue: "R$ 500.000,00",
    status: "active",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  };
}

describe("LocalEnterpriseRepository", () => {
  let repo: LocalEnterpriseRepository;

  beforeEach(() => {
    localStorage.clear();
    repo = new LocalEnterpriseRepository();
  });

  it("deve criar e listar empreendimentos", async () => {
    const enterprise = makeEnterprise();
    await repo.create(enterprise);

    const all = await repo.findAll();
    expect(all).toHaveLength(1);
    expect(all[0].name).toBe("NC1");
  });

  it("deve buscar empreendimento por id", async () => {
    const enterprise = makeEnterprise();
    await repo.create(enterprise);

    const found = await repo.findById("ent-1");
    expect(found).not.toBeNull();
    expect(found!.name).toBe("NC1");
  });

  it("deve retornar null para id inexistente", async () => {
    const found = await repo.findById("nao-existe");
    expect(found).toBeNull();
  });

  it("deve atualizar empreendimento", async () => {
    await repo.create(makeEnterprise());

    const updated = await repo.update("ent-1", { name: "NC1 v2" });
    expect(updated.name).toBe("NC1 v2");
    expect(updated.sector).toBe("Tecnologia");
  });

  it("deve deletar empreendimento", async () => {
    await repo.create(makeEnterprise());
    await repo.delete("ent-1");

    const all = await repo.findAll();
    expect(all).toHaveLength(0);
  });

  it("deve verificar se está vazio", async () => {
    expect(await repo.isEmpty()).toBe(true);

    await repo.create(makeEnterprise());
    expect(await repo.isEmpty()).toBe(false);
  });
});
