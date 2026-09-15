import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../auth/AuthContext';
import { Bell, User, Home } from 'lucide-react';

export const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content-area">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link 
              to="/" 
              className="btn btn-secondary btn-sm" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem', fontWeight: 600 }}
              title="Return to Public Website Home Page"
            >
              <Home size={15} /> Home Page
            </Link>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Lanka Transit Services (Pvt) Ltd • Operations Portal</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/customer-service/notifications" style={{ position: 'relative', color: '#64748b', display: 'flex', alignItems: 'center' }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444'
              }}></span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#eff6ff', color: '#1e40af', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem'
              }}>
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 700, display: 'block', lineHeight: 1.2 }}>{user?.fullName}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{user?.role?.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
