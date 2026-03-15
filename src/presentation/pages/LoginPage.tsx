import { Building2, Lock, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../components";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Enterprise Manager</h1>
          <p className="text-blue-200 mt-2">
            Gestão de Empreendimentos em Santa Catarina
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-text mb-6 text-center">
            Acesse sua conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-9 text-text-muted"
              />
              <Input
                label="Usuário"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-9 text-text-muted"
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Entrar
            </Button>
          </form>

          <p className="text-xs text-text-muted text-center mt-6">
            Enterprise Manager &copy; {new Date().getFullYear()} — SC, Brasil
          </p>
        </div>
      </div>
    </div>
  );
}
