import type { Enterprise } from "../../domain/entities";
import type { EnterpriseRepository } from "../../domain/repositories";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter";

const STORAGE_KEY = "enterprise_manager_enterprises";

export class LocalEnterpriseRepository implements EnterpriseRepository {
  private adapter = new LocalStorageAdapter<Enterprise>(STORAGE_KEY);

  async findAll(): Promise<Enterprise[]> {
    return this.adapter.findAll();
  }

  async findById(id: string): Promise<Enterprise | null> {
    return this.adapter.findById(id);
  }

  async create(enterprise: Enterprise): Promise<Enterprise> {
    return this.adapter.create(enterprise);
  }

  async update(id: string, data: Partial<Enterprise>): Promise<Enterprise> {
    return this.adapter.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.adapter.delete(id);
  }

  async isEmpty(): Promise<boolean> {
    return this.adapter.isEmpty();
  }
}
