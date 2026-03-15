import { Building2, TrendingUp, Users, MapPin } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, {user?.name || "Usuário"}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          Gerencie os empreendimentos de Santa Catarina de forma simples e
          eficiente.
        </p>
      </div>

      {/* Cards informativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard
          icon={<Building2 size={24} />}
          title="Empreendimentos"
          description="Cadastre, edite e acompanhe os empreendimentos catarinenses."
          color="bg-blue-50 text-primary"
        />
        <InfoCard
          icon={<TrendingUp size={24} />}
          title="Crescimento"
          description="Acompanhe o crescimento do ecossistema empreendedor em SC."
          color="bg-green-50 text-secondary"
        />
        <InfoCard
          icon={<Users size={24} />}
          title="Colaboradores"
          description="Monitore o total de funcionários nas empresas cadastradas."
          color="bg-amber-50 text-accent"
        />
        <InfoCard
          icon={<MapPin size={24} />}
          title="Regiões"
          description="Visualize a distribuição geográfica dos empreendimentos."
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Sobre o sistema */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-text mb-3">
          Sobre o Sistema
        </h2>
        <p className="text-text-muted leading-relaxed">
          O <strong>Enterprise Manager</strong> é um sistema de gestão de
          empreendimentos focado no ecossistema de inovação de Santa Catarina.
          Com ele, é possível cadastrar novos empreendimentos, acompanhar seu
          desempenho e gerar relatórios para análise do cenário empreendedor do
          estado. Santa Catarina é um dos estados mais inovadores do Brasil, com
          polos tecnológicos em Florianópolis, Joinville, Blumenau e outras
          cidades que impulsionam o desenvolvimento econômico regional.
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-3`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  );
}
