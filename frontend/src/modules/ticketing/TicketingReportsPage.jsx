import React, { useState, useEffect } from 'react';
import ticketingService from './ticketingService';
import StatsCard from '../../components/StatsCard';
import { BarChart3, DollarSign, CreditCard, RefreshCcw, TrendingUp, AlertCircle } from 'lucide-react';

export const TicketingReportsPage = () => {
  const [report, setReport] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReport = async () => {
    setLoading(true);
    try {
      const [repRes, payRes] = await Promise.all([
        ticketingService.getFinancialReport(),
        ticketingService.getPayments()
      ]);
      setReport(repRes.data || {});
      setPayments(payRes.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const totalRevenue = report?.totalRevenue || 0;
  const totalRefunds = report?.totalRefunds || 0;
  const netRevenue = report?.netRevenue || (totalRevenue - totalRefunds);
  const totalTransactions = report?.totalTransactions || payments.length;

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Financial & Revenue Performance</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time auditing of bus ticket sales, revenue inflows, refunds, and net margins.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Calculating financial metrics...</div>
      ) : (
        <>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <StatsCard
              title="Gross Ticket Revenue"
              value={`LKR ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<DollarSign size={24} />}
              color="primary"
            />
            <StatsCard
              title="Total Refunds Issued"
              value={`LKR ${totalRefunds.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<RefreshCcw size={24} />}
              color="danger"
            />
            <StatsCard
              title="Net Operating Balance"
              value={`LKR ${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              icon={<TrendingUp size={24} />}
              color="success"
            />
            <StatsCard
              title="Total Transactions"
              value={totalTransactions}
              icon={<CreditCard size={24} />}
              color="warning"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-color)' }}>
                Payment Method Share
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Credit / Debit Cards</span>
                    <span style={{ fontWeight: 600 }}>72%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '72%', height: '100%', backgroundColor: 'var(--primary-color)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Counter Cash (Depot Terminals)</span>
                    <span style={{ fontWeight: 600 }}>20%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', backgroundColor: '#F59E0B' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>LankaQR / Online Transfer</span>
                    <span style={{ fontWeight: 600 }}>8%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '8%', height: '100%', backgroundColor: '#10B981' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-color)' }}>
                High Demand Revenue Corridors
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                  <span>1. Colombo &harr; Kandy (AC Highway)</span>
                  <strong style={{ color: '#059669' }}>LKR 450,000+</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                  <span>2. Colombo &harr; Galle (Southern Expy)</span>
                  <strong style={{ color: '#059669' }}>LKR 380,000+</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                  <span>3. Colombo &harr; Jaffna (Night Mail Coach)</span>
                  <strong style={{ color: '#059669' }}>LKR 295,000+</strong>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketingReportsPage;
