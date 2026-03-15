import type { UserProfile } from "../../domain/entities";
import { LocalUserRepository } from "../../infrastructure/repositories";
import { CryptoService } from "../CryptoService";

const AUTH_SESSION_KEY = "enterprise_manager_session";

export class AuthService {
  private userRepository = new LocalUserRepository();

  /**
   * Realiza o login do usuário verificando credenciais.
   */
  async login(username: string, password: string): Promise<UserProfile> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error("Usuário ou senha inválidos.");
    }

    const isValid = await CryptoService.verifyPassword(
      password,
      user.passwordHash,
    );

    if (!isValid) {
      throw new Error("Usuário ou senha inválidos.");
    }

    const profile: UserProfile = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(profile));
    return profile;
  }

  /**
   * Encerra a sessão do usuário.
   */
  logout(): void {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
  }

  /**
   * Retorna o usuário autenticado ou null se não houver sessão.
   */
  getCurrentUser(): UserProfile | null {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  /**
   * Verifica se há um usuário autenticado.
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
