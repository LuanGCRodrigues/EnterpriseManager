import type { Enterprise } from "../entities";

export interface EnterpriseRepository {
  findAll(): Promise<Enterprise[]>;
  findById(id: string): Promise<Enterprise | null>;
  create(enterprise: Enterprise): Promise<Enterprise>;
  update(id: string, data: Partial<Enterprise>): Promise<Enterprise>;
  delete(id: string): Promise<void>;
}
