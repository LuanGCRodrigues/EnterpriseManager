import type { User } from "../domain/entities";
import { LocalUserRepository } from "../infrastructure/repositories";
import { CryptoService } from "../services/CryptoService";

/**
 * Inicializa os dados padrão da aplicação.
 * Cria o usuário admin.
 */
export async function seedDatabase(): Promise<void> {
  const userRepository = new LocalUserRepository();

  // Seed do usuário admin
  if (await userRepository.isEmpty()) {
    const passwordHash = await CryptoService.hashPassword("123");
    const admin: User = {
      id: CryptoService.generateId(),
      username: "admin",
      name: "Administrador",
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await userRepository.create(admin);
    console.log("[Seed] Usuário admin criado com sucesso.");
  }
}
