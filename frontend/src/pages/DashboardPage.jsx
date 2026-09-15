import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../auth/AuthContext';
import StatsCard from '../components/StatsCard';
import { 
  Bus, Calendar, BookmarkCheck, DollarSign, Award, 
  MessageSquare, PartyPopper, Users, ArrowRight, ShieldCheck, CheckCircle2,
  Ticket, Gift, Star, Clock, Home
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role || '';
  const isCustomer = role === 'CUSTOMER';
  const isAdmin = role === 'SYSTEM_ADMIN';
  const isOps = role === 'OPERATIONS_MANAGER';
  const isFinance = role === 'FINANCE_ADMIN';
  const isDepot = role === 'BUS_DEPOT_SUPERVISOR';
  const isPlanner = role === 'TRANSPORT_PLANNING_OFFICER';
  const isCustomerService = role === 'CUSTOMER_SERVICE_SUPERVISOR';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = user?.customerId ? `/dashboard/stats?customerId=${user.customerId}` : '/dashboard/stats';
        const res = await axiosClient.get(url);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div>
      {/* WELCOME BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '1.75rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            {role.replace(/_/g, ' ')}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.4rem 0 0.2rem' }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>
            {isCustomer 
              ? 'Lanka Transit Passenger Booking & Loyalty Portal'
              : 'Lanka Transit Centralized Operations & Fleet Management System'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/" 
            className="btn btn-secondary btn-sm" 
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Home size={15} /> Home Page
          </Link>

          {isCustomer ? (
            <>
              <Link to="/search" className="btn btn-accent btn-sm">
                <Bus size={16} /> Book a Trip (Seat Map)
              </Link>
              <Link to="/rewards/points" className="btn btn-outline btn-sm" style={{ color: '#ffffff', borderColor: '#ffffff' }}>
                <Award size={16} /> My Rewards
              </Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a7f3d0', fontSize: '0.85rem' }}>
              <ShieldCheck size={18} /> Verified Staff Session
            </div>
          )}
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {isCustomer ? (
          <>
            <StatsCard
              title="My Active Bookings"
              value={stats?.myReservationsCount || 0}
              icon={BookmarkCheck}
              color="primary"
              subtitle="Confirmed seat reservations"
            />
            <StatsCard
              title="My Loyalty Points"
              value={`${stats?.myPointsBalance || 0} pts`}
              icon={Award}
              color="amber"
              subtitle={`Current Tier: ${stats?.myTier || 'BRONZE'}`}
            />
            <StatsCard
              title="Available Expressway Trips"
              value={stats?.activeTripsCount || 12}
              icon={Bus}
              color="green"
              subtitle="Daily departures across Sri Lanka"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Operational Buses"
              value={stats?.activeBusesCount || 0}
              icon={Bus}
              color="primary"
              subtitle="Coaches active in depot fleet"
            />
            <StatsCard
              title="Active Scheduled Trips"
              value={stats?.activeTripsCount || 0}
              icon={Calendar}
              color="indigo"
              subtitle="Daily intercity schedules"
            />
            <StatsCard
              title="Total Reservations"
              value={stats?.totalReservationsCount || 0}
              icon={BookmarkCheck}
              color="amber"
              subtitle="Seats booked across network"
            />
            <StatsCard
              title="Total Revenue"
              value={`Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`}
              icon={DollarSign}
              color="green"
              subtitle="Ticketing & fares collected"
            />
          </>
        )}
      </div>

      {/* QUICK MODULE ACCESS (ROLE FILTERED) */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
            {isCustomer ? 'Passenger Services & Quick Actions' : 'Authorized Functional Modules'}
          </h3>
          <span className="badge badge-primary">
            {isCustomer ? 'Customer Portal' : 'Staff Access Scope'}
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            
            {/* PASSENGER ACTIONS (If CUSTOMER) */}
            {isCustomer && (
              <>
                <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #1e3a8a' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '0.05em' }}>FR-02 • RESERVATION MANAGEMENT</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.3rem 0' }}>Seat Reservations</div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                    Book seats on express coaches, modify reserved seats, or cancel bookings with instant seat release.
                  </div>
                  <Link to="/reservations" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    Manage My Bookings <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #d97706' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', letterSpacing: '0.05em' }}>FR-04 • LOYALTY REWARDS</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.3rem 0' }}>Points & Tier Benefits</div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                    Check accumulated travel points balance, view tier multipliers, and redeem free coach ride vouchers.
                  </div>
                  <Link to="/rewards/points" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                    View Points Balance <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #7c3aed' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.05em' }}>FR-05 • CUSTOMER SERVICE</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.3rem 0' }}>Helpdesk & Grievances</div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                    Lodge trip complaints, track supervisor resolution progress, or view live journey advisories.
                  </div>
                  <Link to="/customer-service/complaints" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                    Customer Service Desk <ArrowRight size={14} />
                  </Link>
                </div>
              </>
            )}

            {/* STAFF / ADMIN 6 CORE FUNCTIONAL REQUIREMENTS */}
            {!isCustomer && (
              <>
                {(isAdmin || isOps || isPlanner || isDepot) && (
                  <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #1e3a8a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '0.05em' }}>FR-01</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>CRUD Active</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0' }}>Trip Planning & Scheduling</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Manage bus timetable departures, routes, bus fleet, and driver allocations. Full Create, Read, Update, and Delete.
                    </div>
                    <Link to="/trip-planning/schedules" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Open Schedules Module <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {(isAdmin || isOps) && (
                  <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #2563eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>FR-02</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>CRUD Active</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0' }}>Reservation Management</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Direct seat bookings, passenger manifests, seat reallocation, and cancellations with instant seat unlocking.
                    </div>
                    <Link to="/reservations" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Open Reservations Module <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {(isAdmin || isFinance) && (
                  <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #059669' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.05em' }}>FR-03</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>CRUD Active</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0' }}>Ticketing & Fare Management</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Configure base fares, per-kilometer rates, passenger concessions, and test live pricing simulator calculations.
                    </div>
                    <Link to="/ticketing/fares" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Open Fares Module <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {(isAdmin || isFinance) && (
                  <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #d97706' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', letterSpacing: '0.05em' }}>FR-04</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>CRUD Active</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0' }}>Loyalty Rewards Management</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Create and update loyalty tier criteria, points multiplier rates, discount privileges, and customer points.
                    </div>
                    <Link to="/rewards/programs" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Open Loyalty Module <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {(isAdmin || isCustomerService) && (
                  <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #7c3aed' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.05em' }}>FR-05</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>CRUD Active</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0' }}>Customer Service Management</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Manage complaint tickets through full lifecycle (OPEN to RESOLVED), add resolution remarks, or delete records.
                    </div>
                    <Link to="/customer-service/complaints" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Open Service Module <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {(isAdmin || isOps || isDepot) && (
                  <div className="card" style={{ padding: '1.25rem', borderTop: '4px solid #db2777' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#db2777', letterSpacing: '0.05em' }}>FR-06</span>
                      <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>CRUD Active</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '0.2rem 0' }}>Special Event Transport</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Book and schedule private charter buses for corporate outings, sports events, and group excursions.
                    </div>
                    <Link to="/events" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Open Events Module <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
