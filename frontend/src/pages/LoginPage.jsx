import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Bus, LogIn, Key, Shield, User, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (u, p) => {
    setUsername(u);
    setPassword(p);
    setLoading(true);
    setError(null);
    try {
      await login(u, p);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            backgroundColor: '#1e3a8a', color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem'
          }}>
            <Bus size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Welcome to Lanka Transit</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Sign in to manage your bookings and operational services</p>
        </div>

        {/* LOGIN CARD */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          {error && (
            <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
            Don't have an account? <Link to="/register" style={{ fontWeight: 700, color: '#1e3a8a' }}>Register here</Link>
          </div>
        </div>

        {/* QUICK LOGIN PRESETS FOR DEMONSTRATION & TESTING */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '0.75rem' }}>
            <Sparkles size={16} color="#fbbf24" /> 1-Click Fast Login (Portal Role Switcher)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button type="button" onClick={() => quickLogin('customer', 'Customer@123')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
              👤 Customer
            </button>
            <button type="button" onClick={() => quickLogin('planner', 'Planner@123')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
              🧭 Planning Officer
            </button>
            <button type="button" onClick={() => quickLogin('supervisor', 'Supervisor@123')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
              💬 Service Supervisor
            </button>
            <button type="button" onClick={() => quickLogin('finance', 'Finance@123')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
              💳 Finance Admin
            </button>
            <button type="button" onClick={() => quickLogin('opsmanager', 'Ops@123')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
              🚌 Operations Mgr
            </button>
            <button type="button" onClick={() => quickLogin('admin', 'Admin@123')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start', fontSize: '0.75rem' }}>
              ⚡ System Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
