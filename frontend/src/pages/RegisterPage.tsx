import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { StatusAlert } from "../components/StatusAlert";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await register(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail ?? "Não foi possível criar a conta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Criar conta</h1>
        <p>Cadastre-se para acessar favoritos e histórico de busca.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Email
            <input
              className="search-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Senha
            <input
              className="search-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              disabled={submitting}
            />
          </label>

          <label className="auth-label">
            Confirmar senha
            <input
              className="search-input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              disabled={submitting}
            />
          </label>

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {error && <StatusAlert variant="error" message={error} />}

        <div className="auth-helper">
          Já possui conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </section>
  );
}