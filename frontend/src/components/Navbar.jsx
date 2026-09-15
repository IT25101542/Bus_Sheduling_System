import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, User, LogIn, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="public-navbar">
      <Link to="/" className="brand-logo">
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: '#1e3a8a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Bus size={22} />
        </div>
        <div>
          <span>Lanka Transit</span>
          <span style={{ fontSize: '0.65rem', display: 'block', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
            SERVICES (PVT) LTD
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>
          Home
        </Link>
        <Link to="/search" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Search size={16} /> Search Trips
        </Link>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard size={16} /> Dashboard ({user?.role?.replace('_', ' ')})
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">
              <LogIn size={16} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
