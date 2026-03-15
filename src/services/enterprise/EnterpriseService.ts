import type {
  CreateEnterpriseDTO,
  Enterprise,
  UpdateEnterpriseDTO,
} from "../../domain/entities";
import { LocalEnterpriseRepository } from "../../infrastructure/repositories";
import { CryptoService } from "../CryptoService";

export class EnterpriseService {
  private repository = new LocalEnterpriseRepository();

  async list(): Promise<Enterprise[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Enterprise | null> {
    return this.repository.findById(id);
  }

  async create(data: CreateEnterpriseDTO): Promise<Enterprise> {
    const now = new Date().toISOString();
    const enterprise: Enterprise = {
      id: CryptoService.generateId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    return this.repository.create(enterprise);
  }

  async update(id: string, data: UpdateEnterpriseDTO): Promise<Enterprise> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error("Empreendimento não encontrado.");
    }

    return this.repository.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  /**
   * Retorna estatísticas básicas dos empreendimentos para relatórios.
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    bySector: Record<string, number>;
    byCity: Record<string, number>;
    totalEmployees: number;
  }> {
    const enterprises = await this.repository.findAll();

    const bySector: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    let totalEmployees = 0;

    for (const e of enterprises) {
      bySector[e.sector] = (bySector[e.sector] || 0) + 1;
      byCity[e.city] = (byCity[e.city] || 0) + 1;
      totalEmployees += e.employees;
    }

    return {
      total: enterprises.length,
      active: enterprises.filter((e) => e.status === "active").length,
      inactive: enterprises.filter((e) => e.status === "inactive").length,
      bySector,
      byCity,
      totalEmployees,
    };
  }
}
