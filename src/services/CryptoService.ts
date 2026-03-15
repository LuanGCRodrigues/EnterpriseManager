export class CryptoService {
  /**
   * Gera um hash SHA-256 da senha fornecida.
   */
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Verifica se a senha fornecida corresponde ao hash armazenado.
   */
  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const passwordHash = await this.hashPassword(password);
    return passwordHash === hash;
  }

  /**
   * Gera um ID único utilizando crypto.randomUUID().
   */
  static generateId(): string {
    return crypto.randomUUID();
  }
}
