import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bus, Search, ShieldCheck, Clock, Award, Users, 
  ArrowRight, CheckCircle2, MapPin, Calendar, Star
} from 'lucide-react';

export const HomePage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (origin.trim()) params.append('origin', origin.trim());
    if (destination.trim()) params.append('destination', destination.trim());
    if (date) params.append('date', date);
    navigate(`/search?${params.toString()}`);
  };

  const popularRoutes = [
    { from: 'Colombo (Makumbura)', to: 'Galle', type: 'Highway Express (E-01)', time: '1h 30m', fare: 'Rs. 850' },
    { from: 'Colombo (Fort)', to: 'Kandy', type: 'Luxury AC Direct', time: '3h 00m', fare: 'Rs. 650' },
    { from: 'Colombo (Fort)', to: 'Jaffna', type: 'A9 Northern Super Luxury', time: '7h 30m', fare: 'Rs. 2,400' },
    { from: 'Colombo (Fort)', to: 'Badulla', type: 'Hill Country Scenic Express', time: '6h 00m', fare: 'Rs. 1,250' },
    { from: 'Colombo (Fort)', to: 'Anuradhapura', type: 'Sacred City Luxury AC', time: '4h 30m', fare: 'Rs. 950' },
    { from: 'Colombo (Fort)', to: 'Trincomalee', type: 'Eastern Coast Express', time: '5h 30m', fare: 'Rs. 1,600' },
    { from: 'Colombo (Fort)', to: 'Negombo', type: 'Airport & Highway Shuttle', time: '0h 45m', fare: 'Rs. 450' },
    { from: 'Colombo (Makumbura)', to: 'Hambantota', type: 'Southern Gateway Express', time: '2h 45m', fare: 'Rs. 1,450' },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        color: '#ffffff',
        padding: '5rem 2rem 6rem',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            border: '1px solid rgba(245, 158, 11, 0.4)'
          }}>
            <Bus size={16} /> Official Online Transit Portal of Sri Lanka
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Travel Smarter with <span style={{ color: '#fbbf24' }}>Lanka Transit</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Plan your journey, reserve your seat in real-time, and manage your bus trips with ease across Sri Lanka's expressway and intercity network.
          </p>

          {/* SEARCH BOX */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            maxWidth: '850px',
            margin: '0 auto',
            color: '#0f172a'
          }}>
            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div style={{ textAlign: 'left' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={16} color="#1e3a8a" /> Origin / From
                </label>
                <input
                  type="text"
                  className="form-input"
                  list="origins-list"
                  placeholder="e.g. Colombo (Makumbura)"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
                <datalist id="origins-list">
                  <option value="Colombo (Makumbura)" />
                  <option value="Colombo (Fort)" />
                  <option value="Galle" />
                  <option value="Kandy" />
                  <option value="Jaffna" />
                  <option value="Anuradhapura" />
                  <option value="Badulla" />
                  <option value="Trincomalee" />
                  <option value="Negombo" />
                  <option value="Nuwara Eliya" />
                  <option value="Hambantota" />
                  <option value="Kurunegala" />
                  <option value="Matara" />
                </datalist>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={16} color="#dc2626" /> Destination / To
                </label>
                <input
                  type="text"
                  className="form-input"
                  list="destinations-list"
                  placeholder="e.g. Galle"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <datalist id="destinations-list">
                  <option value="Galle" />
                  <option value="Kandy" />
                  <option value="Jaffna" />
                  <option value="Anuradhapura" />
                  <option value="Badulla" />
                  <option value="Trincomalee" />
                  <option value="Negombo" />
                  <option value="Nuwara Eliya" />
                  <option value="Hambantota" />
                  <option value="Kurunegala" />
                  <option value="Matara" />
                  <option value="Colombo (Makumbura)" />
                  <option value="Colombo (Fort)" />
                </datalist>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={16} color="#1e3a8a" /> Travel Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', height: '44px' }}>
                  <Search size={18} /> Search Trips
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Popular Express Routes</h2>
          <p style={{ color: '#64748b' }}>Frequent luxury departures connecting major commercial centers and tourist hubs.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {popularRoutes.map((r, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {r.type}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  {r.from} → {r.to}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <span><Clock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> {r.time}</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>{r.fare}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/search?origin=${encodeURIComponent(r.from)}&destination=${encodeURIComponent(r.to)}&date=${date}`)}
                className="btn btn-outline btn-sm" 
                style={{ width: '100%' }}
              >
                View Departures <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 2rem', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>How It Works</h2>
            <p style={{ color: '#64748b' }}>Book your bus ticket in 4 simple and intuitive steps</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Search Schedule', desc: 'Choose your origin, destination, and preferred travel date.' },
              { step: '02', title: 'Pick Your Seat', desc: 'Select your preferred window or aisle seat on the visual layout map.' },
              { step: '03', title: 'Instant Mock Pay', desc: 'Confirm passenger details and simulate instant card payment.' },
              { step: '04', title: 'Digital E-Ticket', desc: 'Receive your verified electronic ticket with unique QR reference.' },
            ].map((s, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#eff6ff',
                  color: '#1e3a8a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  margin: '0 auto 1rem',
                  border: '2px solid #bfdbfe'
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTERPRISE SERVICES SHOWCASE */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ color: '#1e3a8a', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Integrated Transit Ecosystem
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
            Comprehensive Travel & Fleet Solutions
          </h2>
          <p style={{ color: '#64748b' }}>Everything you need for seamless travel across Sri Lanka — from express booking to loyalty perks.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {[
            {
              badge: 'Express Timetables',
              title: 'Trip Planning & Scheduling',
              desc: 'Real-time expressway schedules, comprehensive route stops, modern fleet tracking, and automated delay notifications.',
              linkText: 'View Schedules',
              path: '/trip-planning/schedules'
            },
            {
              badge: 'Smart Allocation',
              title: 'Seat Reservation & Booking',
              desc: 'Live interactive 2x2 luxury seat map selection, instant booking confirmation, automated waitlist queue, and seat locks.',
              linkText: 'Book Your Seat',
              path: '/search'
            },
            {
              badge: 'Digital Passes',
              title: 'Ticketing & Smart Fares',
              desc: 'Instant QR-code digital boarding passes, distance-based transparent fare rules, mock digital payments, and refund claims.',
              linkText: 'Explore Fares',
              path: '/ticketing/fares'
            },
            {
              badge: 'Frequent Traveler',
              title: 'Loyalty Rewards & Privileges',
              desc: 'Earn loyalty miles on every journey, climb membership tiers, and redeem points for free bus tickets and travel vouchers.',
              linkText: 'Explore Rewards',
              path: '/rewards/programs'
            },
            {
              badge: '24/7 Assistance',
              title: 'Customer Care & Support',
              desc: 'End-to-end incident grievance tracking, trip review ratings, support ticket resolution, and instant broadcast alerts.',
              linkText: 'Customer Support',
              path: '/customer-service/complaints'
            },
            {
              badge: 'Private Charters',
              title: 'Special Event Transport',
              desc: 'Dedicated charter bus hire for corporate retreats, group tours, weddings, and excursions across Sri Lanka.',
              linkText: 'Special Events',
              path: '/events'
            },
          ].map((service, idx) => (
            <div key={idx} className="card" style={{ padding: '1.5rem', borderTop: '4px solid #1e3a8a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{service.badge}</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>{service.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {service.desc}
                </p>
              </div>
              <Link to={service.path} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                {service.linkText} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
