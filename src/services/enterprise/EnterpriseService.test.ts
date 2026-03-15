import { beforeEach, describe, expect, it } from "vitest";
import type { CreateEnterpriseDTO } from "../../domain/entities";
import { EnterpriseService } from "./EnterpriseService";

describe("EnterpriseService", () => {
  let service: EnterpriseService;

  beforeEach(() => {
    localStorage.clear();
    service = new EnterpriseService();
  });

  describe("create", () => {
    it("deve criar empreendimento com id e timestamps gerados", async () => {
      const dto: CreateEnterpriseDTO = {
        name: "Nova Empresa",
        owner: "Maria Souza",
        email: "maria@novaempresa.com",
        phone: "(48) 99999-0001",
        description: "Descrição",
        sector: "Saúde",
        city: "Joinville",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 5,
        revenue: "R$ 100.000,00",
        status: "active",
      };

      const created = await service.create(dto);

      expect(created.id).toBeDefined();
      expect(created.name).toBe("Nova Empresa");
      expect(created.createdAt).toBeDefined();
      expect(created.updatedAt).toBeDefined();
    });
  });

  describe("list", () => {
    it("deve listar todos os empreendimentos", async () => {
      await service.create({
        name: "Empresa A",
        owner: "Dono A",
        email: "a@empresa.com",
        phone: "(48) 99999-0002",
        description: "A",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 5,
        revenue: "R$ 100.000,00",
        status: "active",
      });
      await service.create({
        name: "Empresa B",
        owner: "Dono B",
        email: "b@empresa.com",
        phone: "(47) 99999-0003",
        description: "B",
        sector: "Saúde",
        city: "Joinville",
        state: "SC",
        foundedAt: "2024-06-01",
        employees: 10,
        revenue: "R$ 200.000,00",
        status: "inactive",
      });

      const all = await service.list();
      expect(all).toHaveLength(2);
    });
  });

  describe("getById", () => {
    it("deve retornar empreendimento por id", async () => {
      const created = await service.create({
        name: "Empresa C",
        owner: "Dono C",
        email: "c@empresa.com",
        phone: "(48) 99999-0004",
        description: "Desc",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 3,
        revenue: "R$ 50.000,00",
        status: "active",
      });

      const found = await service.getById(created.id);
      expect(found).not.toBeNull();
      expect(found!.name).toBe("Empresa C");
    });
  });

  describe("update", () => {
    it("deve atualizar empreendimento existente", async () => {
      const created = await service.create({
        name: "Origin Tec",
        owner: "Dono OT",
        email: "ot@empresa.com",
        phone: "(48) 99999-0005",
        description: "Desc",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 3,
        revenue: "R$ 50.000,00",
        status: "active",
      });

      const updated = await service.update(created.id, {
        name: "Atualizado",
      });

      expect(updated.name).toBe("Atualizado");
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it("deve lançar erro ao atualizar empreendimento inexistente", async () => {
      await expect(service.update("nao-existe", { name: "X" })).rejects.toThrow(
        "Empreendimento não encontrado.",
      );
    });
  });

  describe("delete", () => {
    it("deve deletar empreendimento existente", async () => {
      const created = await service.create({
        name: "Deletável",
        owner: "Dono Del",
        email: "del@empresa.com",
        phone: "(48) 99999-0006",
        description: "Desc",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 2,
        revenue: "R$ 30.000,00",
        status: "inactive",
      });

      await service.delete(created.id);
      const all = await service.list();
      expect(all).toHaveLength(0);
    });
  });

  describe("getStatistics", () => {
    it("deve retornar estatísticas corretas", async () => {
      await service.create({
        name: "A",
        owner: "Dono A",
        email: "a@stats.com",
        phone: "(48) 99999-0007",
        description: "A",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 10,
        revenue: "R$ 100.000,00",
        status: "active",
      });
      await service.create({
        name: "B",
        owner: "Dono B",
        email: "b@stats.com",
        phone: "(47) 99999-0008",
        description: "B",
        sector: "Saúde",
        city: "Joinville",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 20,
        revenue: "R$ 200.000,00",
        status: "inactive",
      });
      await service.create({
        name: "C",
        owner: "Dono C",
        email: "c@stats.com",
        phone: "(48) 99999-0009",
        description: "C",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2024-01-01",
        employees: 5,
        revenue: "R$ 50.000,00",
        status: "inactive",
      });

      const stats = await service.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.active).toBe(1);
      expect(stats.inactive).toBe(2);
      expect(stats.totalEmployees).toBe(35);
      expect(stats.bySector["Tecnologia"]).toBe(2);
      expect(stats.bySector["Saúde"]).toBe(1);
      expect(stats.byCity["Florianópolis"]).toBe(2);
      expect(stats.byCity["Joinville"]).toBe(1);
    });

    it("deve retornar estatísticas zeradas sem dados", async () => {
      const stats = await service.getStatistics();
      expect(stats.total).toBe(0);
      expect(stats.totalEmployees).toBe(0);
    });
  });
});
