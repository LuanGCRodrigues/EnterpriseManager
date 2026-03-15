import type { User } from "../../domain/entities";
import type { UserRepository } from "../../domain/repositories";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter";

const STORAGE_KEY = "enterprise_manager_users";

export class LocalUserRepository implements UserRepository {
  private adapter = new LocalStorageAdapter<User>(STORAGE_KEY);

  async findAll(): Promise<User[]> {
    return this.adapter.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.adapter.findById(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.adapter.findBy((user) => user.username === username);
  }

  async create(user: User): Promise<User> {
    return this.adapter.create(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.adapter.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.adapter.delete(id);
  }

  async isEmpty(): Promise<boolean> {
    return this.adapter.isEmpty();
  }
}
