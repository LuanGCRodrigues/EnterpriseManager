import { describe, it, expect } from "vitest";
import { CryptoService } from "./CryptoService";

describe("CryptoService", () => {
  describe("hashPassword", () => {
    it("deve gerar um hash SHA-256 em hexadecimal", async () => {
      const hash = await CryptoService.hashPassword("123");
      // SHA-256 gera 64 chars hex
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("deve gerar hashes iguais para a mesma senha", async () => {
      const hash1 = await CryptoService.hashPassword("minhaSenha");
      const hash2 = await CryptoService.hashPassword("minhaSenha");
      expect(hash1).toBe(hash2);
    });

    it("deve gerar hashes diferentes para senhas diferentes", async () => {
      const hash1 = await CryptoService.hashPassword("senha1");
      const hash2 = await CryptoService.hashPassword("senha2");
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("verifyPassword", () => {
    it("deve retornar true para senha correta", async () => {
      const hash = await CryptoService.hashPassword("secreta");
      const result = await CryptoService.verifyPassword("secreta", hash);
      expect(result).toBe(true);
    });

    it("deve retornar false para senha incorreta", async () => {
      const hash = await CryptoService.hashPassword("secreta");
      const result = await CryptoService.verifyPassword("errada", hash);
      expect(result).toBe(false);
    });
  });

  describe("generateId", () => {
    it("deve gerar um UUID válido", () => {
      const id = CryptoService.generateId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("deve gerar IDs únicos", () => {
      const ids = new Set(
        Array.from({ length: 100 }, () => CryptoService.generateId()),
      );
      expect(ids.size).toBe(100);
    });
  });
});
