import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="brand">
            TaskFlow
          </Link>
          
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/tasks/new" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>New Task</Link>
            <div className="user-menu">
              <span className="user-name">Hi, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
