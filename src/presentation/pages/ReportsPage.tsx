import { BarChart3, Building2, MapPin, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { EnterpriseService } from "../../services";

const enterpriseService = new EnterpriseService();

interface Statistics {
  total: number;
  active: number;
  inactive: number;
  bySector: Record<string, number>;
  byCity: Record<string, number>;
  totalEmployees: number;
}

export function ReportsPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setIsLoading(true);
    try {
      const data = await enterpriseService.getStatistics();
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Erro ao carregar relatórios.</p>
      </div>
    );
  }

  const maxSectorCount = Math.max(...Object.values(stats.bySector), 1);
  const maxCityCount = Math.max(...Object.values(stats.byCity), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Relatórios</h1>
        <p className="text-text-muted">
          Visão geral do ecossistema de empreendimentos em Santa Catarina
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<Building2 size={20} />}
          label="Total de Empreendimentos"
          value={stats.total}
          color="bg-blue-50 text-primary"
        />
        <KPICard
          icon={<TrendingUp size={20} />}
          label="Ativos"
          value={stats.active}
          color="bg-green-50 text-secondary"
          subtitle={
            stats.total > 0
              ? `${Math.round((stats.active / stats.total) * 100)}% do total`
              : ""
          }
        />
        <KPICard
          icon={<Users size={20} />}
          label="Total de Funcionários"
          value={stats.totalEmployees}
          color="bg-amber-50 text-accent"
        />
        <KPICard
          icon={<BarChart3 size={20} />}
          label="Inativos"
          value={stats.inactive}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Setor */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            Empreendimentos por Setor
          </h2>
          {Object.keys(stats.bySector).length === 0 ? (
            <p className="text-text-muted text-sm">Nenhum dado disponível.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.bySector)
                .sort(([, a], [, b]) => b - a)
                .map(([sector, count]) => (
                  <div key={sector}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text font-medium">{sector}</span>
                      <span className="text-text-muted">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxSectorCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Por Cidade */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-secondary" />
            Distribuição por Cidade
          </h2>
          {Object.keys(stats.byCity).length === 0 ? (
            <p className="text-text-muted text-sm">Nenhum dado disponível.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.byCity)
                .sort(([, a], [, b]) => b - a)
                .map(([city, count]) => (
                  <div key={city}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-text font-medium">{city}</span>
                      <span className="text-text-muted">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-secondary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCityCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text mb-4">
          Resumo por Status
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <StatusCard
            label="Ativos"
            count={stats.active}
            total={stats.total}
            color="bg-green-500"
          />
          <StatusCard
            label="Inativos"
            count={stats.inactive}
            total={stats.total}
            color="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-3`}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-sm text-text-muted">{label}</p>
      {subtitle && <p className="text-xs text-secondary mt-1">{subtitle}</p>}
    </div>
  );
}

function StatusCard({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-3">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage} 100`}
            className={color.replace("bg-", "text-")}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text">
          {percentage}%
        </span>
      </div>
      <p className="font-semibold text-text">{count}</p>
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
