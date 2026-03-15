import { Building2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  type CreateEnterpriseDTO,
  type Enterprise,
  cities,
} from "../../domain/entities";
import { EnterpriseService } from "../../services";
import { Button, Input, Modal, Select } from "../components";

const enterpriseService = new EnterpriseService();

const SECTORS = [
  { value: "Tecnologia", label: "Tecnologia" },
  { value: "Sustentabilidade", label: "Sustentabilidade" },
  { value: "Alimentação", label: "Alimentação" },
  { value: "Indústria", label: "Indústria" },
  { value: "Educação", label: "Educação" },
  { value: "Saúde", label: "Saúde" },
  { value: "Turismo", label: "Turismo" },
  { value: "Comércio", label: "Comércio" },
  { value: "Serviços", label: "Serviços" },
  { value: "Agronegócio", label: "Agronegócio" },
  { value: "Outros", label: "Outros" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

const STATUS_BADGES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
};

const EMPTY_FORM: CreateEnterpriseDTO = {
  name: "",
  owner: "",
  email: "",
  phone: "",
  description: "",
  sector: "",
  city: "",
  state: "SC",
  foundedAt: "",
  employees: 0,
  revenue: "",
  status: "active",
};

export function EnterprisesPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEnterpriseDTO>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const cityOptions: Array<{ value: string; label: string }> = cities.map(
    (city) => ({
      value: city,
      label: city,
    }),
  );

  const loadEnterprises = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await enterpriseService.list();
      setEnterprises(data);
    } catch (error) {
      console.error("Erro ao carregar empreendimentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnterprises();
  }, [loadEnterprises]);

  const filteredEnterprises = enterprises.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.sector.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nome é obrigatório.";
    if (!formData.owner.trim())
      errors.owner = "Empreendedor responsável é obrigatório.";
    if (!formData.email.trim()) errors.email = "E-mail é obrigatório.";
    if (!formData.phone.trim()) errors.phone = "Telefone é obrigatório.";
    if (!formData.description.trim())
      errors.description = "Descrição é obrigatória.";
    if (!formData.sector) errors.sector = "Setor é obrigatório.";
    if (!formData.city) errors.city = "Cidade é obrigatória.";
    if (!formData.foundedAt)
      errors.foundedAt = "Data de fundação é obrigatória.";
    if (formData.employees < 0)
      errors.employees = "Número de funcionários inválido.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openCreateModal = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (enterprise: Enterprise) => {
    setFormData(enterprise);
    setEditingId(enterprise.id);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingId) {
        await enterpriseService.update(editingId, formData);
      } else {
        await enterpriseService.create(formData);
      }
      setIsModalOpen(false);
      await loadEnterprises();
    } catch (error) {
      console.error("Erro ao salvar empreendimento:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await enterpriseService.delete(id);
      setDeleteConfirmId(null);
      await loadEnterprises();
    } catch (error) {
      console.error("Erro ao excluir empreendimento:", error);
    }
  };

  const updateField = <K extends keyof CreateEnterpriseDTO>(
    field: K,
    value: CreateEnterpriseDTO[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-col sm:grid-cols-2 lg:grid-cols-3 sm:items-center sm:justify-between gap-4">
        <div className="col-span-1 lg:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            placeholder="Buscar por nome, cidade ou setor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={openCreateModal}>
          <Plus size={18} />
          Novo Empreendimento
        </Button>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full" />
        </div>
      ) : filteredEnterprises.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-xl">
          <Building2 size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-medium text-text mb-1">
            Nenhum empreendimento encontrado
          </h3>
          <p className="text-text-muted mb-4">
            {searchTerm
              ? "Tente ajustar sua busca."
              : "Comece cadastrando o primeiro empreendimento."}
          </p>
          {!searchTerm && (
            <Button onClick={openCreateModal}>
              <Plus size={18} />
              Cadastrar Empreendimento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEnterprises.map((enterprise) => (
            <div
              key={enterprise.id}
              className="bg-white border border-border rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text truncate">
                      {enterprise.name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${STATUS_BADGES[enterprise.status]}`}
                    >
                      {STATUS_LABELS[enterprise.status]}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mb-3 line-clamp-2">
                    {enterprise.description}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                    <span>
                      📍 {enterprise.city}/{enterprise.state}
                    </span>
                    <span>🏢 {enterprise.sector}</span>
                    <span>👥 {enterprise.employees} funcionários</span>
                    <span>💰 {enterprise.revenue}</span>
                    <span>👤 {enterprise.owner}</span>
                    <span>📧 {enterprise.email}</span>
                    <span>📞 {enterprise.phone}</span>
                    <span>
                      📅 Fundada em{" "}
                      {new Date(enterprise.foundedAt).toLocaleDateString(
                        "pt-BR",
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(enterprise)}
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </Button>
                  {deleteConfirmId === enterprise.id ? (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(enterprise.id)}
                      >
                        Confirmar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(enterprise.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} className="text-danger" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de criação/edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Editar Empreendimento" : "Novo Empreendimento"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            placeholder="Nome do empreendimento"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={formErrors.name}
          />

          <Input
            label="Empreendedor Responsável"
            placeholder="Nome do responsável"
            value={formData.owner}
            onChange={(e) => updateField("owner", e.target.value)}
            error={formErrors.owner}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="email@exemplo.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={formErrors.email}
            />
            <Input
              label="Telefone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              error={formErrors.phone}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-text mb-1">
              Descrição
            </label>
            <textarea
              className={`
                w-full px-3 py-2 border rounded-lg text-text bg-white
                transition-colors duration-200 resize-none
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                placeholder:text-text-muted
                ${formErrors.description ? "border-danger" : "border-border"}
              `}
              rows={3}
              placeholder="Descreva o empreendimento"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-danger">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Setor"
              options={SECTORS}
              value={formData.sector}
              onChange={(e) => updateField("sector", e.target.value)}
              error={formErrors.sector}
            />
            <Select
              label="Cidade"
              options={cityOptions}
              value={formData.city}
              onChange={(e) => updateField("city", e.target.value)}
              error={formErrors.city}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data de Fundação"
              type="date"
              value={formData.foundedAt}
              onChange={(e) => updateField("foundedAt", e.target.value)}
              error={formErrors.foundedAt}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={formData.status}
              onChange={(e) =>
                updateField("status", e.target.value as "active" | "inactive")
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Funcionários"
              type="number"
              min="0"
              value={String(formData.employees)}
              onChange={(e) =>
                updateField("employees", parseInt(e.target.value) || 0)
              }
              error={formErrors.employees}
            />
            <Input
              label="Faturamento"
              placeholder="R$ 0,00"
              value={formData.revenue}
              onChange={(e) => updateField("revenue", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editingId ? "Salvar Alterações" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
