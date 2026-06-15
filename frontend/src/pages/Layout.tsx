import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <div className="brand">🎌 Anime Aggregator</div>

          <nav className="nav">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/search" className="nav-link">
              Busca
            </NavLink>
            <NavLink to="/favorites" className="nav-link">
              Favoritos
            </NavLink>
            <NavLink to="/history" className="nav-link">
              Histórico
            </NavLink>
            {!isAuthenticated && (
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            )}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="user-badge">{user?.email}</span>
                <button className="button secondary" onClick={handleLogout}>
                  Sair
                </button>
              </>
            ) : (
              <span className="user-badge">Modo visitante</span>
            )}
          </div>
        </div>
      </header>

      <main className="container app-content">
        <Outlet />
      </main>
    </div>
  );
}