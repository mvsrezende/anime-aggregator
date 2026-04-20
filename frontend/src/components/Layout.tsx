import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
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
          </nav>
        </div>
      </header>

      <main className="container app-content">
        <Outlet />
      </main>
    </div>
  );
}