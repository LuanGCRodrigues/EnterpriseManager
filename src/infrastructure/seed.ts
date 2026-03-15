import type { Enterprise, User } from "../domain/entities";
import {
  LocalEnterpriseRepository,
  LocalUserRepository,
} from "../infrastructure/repositories";
import { CryptoService } from "../services/CryptoService";

/**
 * Inicializa os dados padrão da aplicação.
 * Cria o usuário admin e alguns empreendimentos de exemplo.
 */
export async function seedDatabase(): Promise<void> {
  const userRepository = new LocalUserRepository();
  const enterpriseRepository = new LocalEnterpriseRepository();

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

  // Seed de empreendimentos de exemplo
  if (await enterpriseRepository.isEmpty()) {
    const sampleEnterprises: Enterprise[] = [
      {
        id: CryptoService.generateId(),
        name: "João Inovação",
        owner: "João Pedro Martins",
        email: "joao@inovacao.com.br",
        phone: "(48) 99101-2030",
        description:
          "Startup de tecnologia focada em soluções de IoT para agronegócio catarinense.",
        sector: "Tecnologia",
        city: "Florianópolis",
        state: "SC",
        foundedAt: "2022-03-15",
        employees: 25,
        revenue: "R$ 1.200.000,00",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: CryptoService.generateId(),
        name: "Verde Sul Sustentável",
        owner: "Ana Clara Souza",
        email: "ana@verdesul.com.br",
        phone: "(47) 99202-3040",
        description:
          "Empresa especializada em consultoria ambiental e energias renováveis.",
        sector: "Sustentabilidade",
        city: "Joinville",
        state: "SC",
        foundedAt: "2020-08-01",
        employees: 42,
        revenue: "R$ 3.500.000,00",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: CryptoService.generateId(),
        name: "Sabores da Serra",
        owner: "Carlos Eduardo Ramos",
        email: "carlos@saboresdaserra.com.br",
        phone: "(49) 99303-4050",
        description:
          "Indústria de alimentos artesanais com produtos típicos da Serra Catarinense.",
        sector: "Alimentação",
        city: "Lages",
        state: "SC",
        foundedAt: "2019-01-10",
        employees: 18,
        revenue: "R$ 800.000,00",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: CryptoService.generateId(),
        name: "Seatech Solutions",
        owner: "Marina Oliveira",
        email: "marina@seatech.com.br",
        phone: "(47) 99404-5060",
        description:
          "Desenvolvimento de software para gestão portuária e logística marítima.",
        sector: "Tecnologia",
        city: "Itajaí",
        state: "SC",
        foundedAt: "2021-06-20",
        employees: 35,
        revenue: "R$ 2.100.000,00",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: CryptoService.generateId(),
        name: "Cerâmica Catarina",
        owner: "Roberto Zanetti",
        email: "roberto@ceramicacatarina.com.br",
        phone: "(48) 99505-6070",
        description:
          "Fabricação de cerâmicas e revestimentos de alta qualidade para exportação.",
        sector: "Indústria",
        city: "Criciúma",
        state: "SC",
        foundedAt: "2015-11-05",
        employees: 120,
        revenue: "R$ 8.000.000,00",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: CryptoService.generateId(),
        name: "Prositech Blumenau",
        owner: "Fernanda Keller",
        email: "fernanda@prositech.com.br",
        phone: "(47) 99606-7080",
        description:
          "Plataforma de ensino online focada em capacitação profissional para o setor cervejeiro.",
        sector: "Educação",
        city: "Blumenau",
        state: "SC",
        foundedAt: "2023-02-28",
        employees: 8,
        revenue: "R$ 350.000,00",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const enterprise of sampleEnterprises) {
      await enterpriseRepository.create(enterprise);
    }
    console.log("[Seed] Empreendimentos de exemplo criados com sucesso.");
  }
}
