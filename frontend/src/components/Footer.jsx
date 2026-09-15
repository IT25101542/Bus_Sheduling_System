import React from 'react';
import { Bus, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '3rem 2rem 1.5rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
            <Bus size={22} color="#fbbf24" /> Lanka Transit Services
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Modern, comfortable, and reliable intercity and expressway bus transportation across Sri Lanka.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Expressway Network</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Southern Expressway (E01)<br />
            Central Expressway (E02 / E04)<br />
            Katunayake Expressway (E03)<br />
            Outer Circular Highway & Intercity Arterials
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Passenger Services</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: 1.8 }}>
            <li>Trip Schedules & Real-Time Tracking</li>
            <li>Seat Reservations & Digital Passes</li>
            <li>Distance-Based Smart Fares & Refunds</li>
            <li>Transit Rewards Loyalty Club</li>
            <li>24/7 Passenger Support Helpdesk</li>
            <li>Corporate Charters & Event Fleet</li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem' }}>
        © 2026 Lanka Transit Services (Pvt) Ltd. All rights reserved. Sri Lanka's Leading Expressway Coach Network.
      </div>
    </footer>
  );
};

export default Footer;
