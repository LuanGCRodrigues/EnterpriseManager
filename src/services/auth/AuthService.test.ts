import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "./AuthService";
import { LocalUserRepository } from "../../infrastructure/repositories";
import { CryptoService } from "../CryptoService";
import type { User } from "../../domain/entities";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepo: LocalUserRepository;

  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    authService = new AuthService();
    userRepo = new LocalUserRepository();

    // Criar usuário de teste
    const passwordHash = await CryptoService.hashPassword("senha123");
    const user: User = {
      id: "user-1",
      username: "admin",
      name: "Administrador",
      passwordHash,
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await userRepo.create(user);
  });

  describe("login", () => {
    it("deve autenticar com credenciais válidas", async () => {
      const profile = await authService.login("admin", "senha123");

      expect(profile.username).toBe("admin");
      expect(profile.name).toBe("Administrador");
      expect(profile.role).toBe("admin");
      // Não deve expor o hash da senha
      expect((profile as unknown as Partial<User>).passwordHash).toBeUndefined();
    });

    it("deve lançar erro com username inválido", async () => {
      await expect(
        authService.login("inexistente", "senha123"),
      ).rejects.toThrow("Usuário ou senha inválidos.");
    });

    it("deve lançar erro com senha inválida", async () => {
      await expect(authService.login("admin", "senhaErrada")).rejects.toThrow(
        "Usuário ou senha inválidos.",
      );
    });

    it("deve salvar a sessão no sessionStorage", async () => {
      await authService.login("admin", "senha123");

      const rawSession = sessionStorage.getItem("enterprise_manager_session");
      expect(rawSession).not.toBeNull();
      const session = JSON.parse(rawSession!);
      expect(session.username).toBe("admin");
    });
  });

  describe("logout", () => {
    it("deve remover a sessão", async () => {
      await authService.login("admin", "senha123");
      authService.logout();

      expect(sessionStorage.getItem("enterprise_manager_session")).toBeNull();
    });
  });

  describe("getCurrentUser", () => {
    it("deve retornar null quando não há sessão", () => {
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it("deve retornar o usuário autenticado", async () => {
      await authService.login("admin", "senha123");

      const user = authService.getCurrentUser();
      expect(user).not.toBeNull();
      expect(user!.username).toBe("admin");
    });

    it("deve retornar null para sessão com JSON inválido", () => {
      sessionStorage.setItem("enterprise_manager_session", "invalid-json");
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("deve retornar false sem sessão", () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it("deve retornar true após login", async () => {
      await authService.login("admin", "senha123");
      expect(authService.isAuthenticated()).toBe(true);
    });

    it("deve retornar false após logout", async () => {
      await authService.login("admin", "senha123");
      authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
