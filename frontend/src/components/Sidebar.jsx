import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Bus, LayoutDashboard, Calendar, MapPin, Users, Clock, 
  BookmarkCheck, Ticket, DollarSign, Award, MessageSquare, 
  PartyPopper, LogOut, ShieldAlert, UserCheck, Gift, Star, Home
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || '';
  const isAdmin = role === 'SYSTEM_ADMIN';
  const isCustomer = role === 'CUSTOMER';
  const isOps = role === 'OPERATIONS_MANAGER';
  const isDepot = role === 'BUS_DEPOT_SUPERVISOR';
  const isPlanner = role === 'TRANSPORT_PLANNING_OFFICER';
  const isFinance = role === 'FINANCE_ADMIN';
  const isCustomerService = role === 'CUSTOMER_SERVICE_SUPERVISOR';

  // Role visibility permissions
  const canViewTripPlanning = isAdmin || isOps || isPlanner || isDepot;
  const canViewReservations = isAdmin || isOps || isCustomer;
  const canViewTicketing = isAdmin || isFinance || isCustomer;
  const canViewLoyalty = isAdmin || isFinance || isCustomer;
  const canViewCustomerService = isAdmin || isCustomerService || isCustomer;
  const canViewEvents = isAdmin || isOps || isDepot;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#1e3a8a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <Bus size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>Lanka Transit</div>
          <div style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 700 }}>
            {role.replace(/_/g, ' ')}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <Home size={18} />
          <span>Home Page</span>
        </NavLink>

        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <div className="sidebar-section-title">Core Functional Modules</div>

        {/* FR1: TRIP PLANNING & SCHEDULING */}
        {canViewTripPlanning && !isCustomer && (
          <NavLink to="/trip-planning/schedules" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Calendar size={18} />
            <span>1. Trip Planning & Schedules</span>
          </NavLink>
        )}

        {/* FR2: RESERVATION MANAGEMENT */}
        {canViewReservations && (
          <NavLink to="/reservations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <BookmarkCheck size={18} />
            <span>2. Reservation Management</span>
          </NavLink>
        )}

        {/* FR3: TICKETING & FARE MANAGEMENT */}
        {canViewTicketing && !isCustomer && (
          <NavLink to="/ticketing/fares" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <DollarSign size={18} />
            <span>3. Ticketing & Fares</span>
          </NavLink>
        )}

        {/* FR4: LOYALTY REWARDS MANAGEMENT */}
        {canViewLoyalty && (
          <NavLink 
            to={isCustomer ? "/rewards/points" : "/rewards/programs"} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Award size={18} />
            <span>4. Loyalty Rewards</span>
          </NavLink>
        )}

        {/* FR5: CUSTOMER SERVICE MANAGEMENT */}
        {canViewCustomerService && (
          <NavLink to="/customer-service/complaints" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <MessageSquare size={18} />
            <span>5. Customer Service</span>
          </NavLink>
        )}

        {/* FR6: EVENT TRANSPORT MANAGEMENT */}
        {!isCustomer && canViewEvents && (
          <NavLink to="/events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <PartyPopper size={18} />
            <span>6. Special Event Charters</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem', background: '#1e293b', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.fullName}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            {user?.email}
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
