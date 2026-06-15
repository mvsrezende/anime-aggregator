import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { StatusAlert } from "../components/StatusAlert";
import { useAuth } from "../context/AuthContext";

type LocationState = {
  from?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();

  const state = location.state as LocationState | null;
  const redirectTo = state?.from ?? "/";

  const [email, setEmail] = useState("marcos.rezende@al.infnet.edu.br");
  const [password, setPassword] = useState("123456");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail ?? "Não foi possível realizar login.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        <p>Entre para acessar favoritos e histórico de busca.</p>

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
              placeholder="Sua senha"
              disabled={submitting}
            />
          </label>

          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {error && <StatusAlert variant="error" message={error} />}

        <div className="auth-helper">
          Ainda não possui conta? <Link to="/register">Criar conta</Link>
        </div>
      </div>
    </section>
  );
}