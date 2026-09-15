import React, { useState, useEffect } from 'react';
import loyaltyService from './loyaltyService';
import StatsCard from '../../components/StatsCard';
import Modal from '../../components/Modal';
import { useAuth } from '../../auth/AuthContext';
import { Award, Gift, History, PlusCircle, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerRewardsPage = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [recentTxns, setRecentTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Admin Grant Points Modal
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(50);
  const [bonusDesc, setBonusDesc] = useState('Customer Goodwill Bonus');

  const customerId = user?.customerId || 1; // Fallback to customer #1 for staff demo

  const loadAccount = async () => {
    setLoading(true);
    try {
      const [accRes, histRes] = await Promise.all([
        loyaltyService.getCustomerAccount(customerId),
        loyaltyService.getCustomerHistory(customerId)
      ]);
      setAccount(accRes.data);
      setRecentTxns((histRes.data || []).slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, [user]);

  const handleGrantBonus = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await loyaltyService.addPoints(customerId, parseInt(bonusPoints, 10), bonusDesc);
      setSuccess(`Successfully credited ${bonusPoints} loyalty points!`);
      setIsBonusModalOpen(false);
      loadAccount();
    } catch (err) {
      setError(err.message);
    }
  };

  const getTierColor = (tier) => {
    switch (tier?.toUpperCase()) {
      case 'PLATINUM': return '#6366F1';
      case 'GOLD': return '#F59E0B';
      case 'SILVER': return '#64748B';
      default: return '#B45309';
    }
  };

  return (
    <div>
      {success && (
        <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {success}
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            Lanka Transit Rewards Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Earn points automatically on every intercity journey and redeem for free tickets & upgrades.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {user?.role !== 'CUSTOMER' && (
            <button
              className="btn btn-outline"
              onClick={() => setIsBonusModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={16} /> Credit Bonus Points
            </button>
          )}
          <Link
            to="/rewards/redeem"
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Gift size={16} /> Redeem Rewards
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading loyalty profile...</div>
      ) : account ? (
        <>
          {/* Hero Tier Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div>
              <span
                style={{
                  backgroundColor: getTierColor(account.tierLevel),
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}
              >
                {account.tierLevel || 'BRONZE'} MEMBER
              </span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>
                {account.customerName || user?.fullName || 'Transit Member'}
              </h1>
              <p style={{ margin: '0.5rem 0 0', opacity: 0.85, fontSize: '0.9rem' }}>
                Account ID: #{account.id} &bull; Member Since: 2026
              </p>
            </div>

            <div style={{ textAlign: 'right', minWidth: '180px' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, textTransform: 'uppercase' }}>Available Balance</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--secondary-color)', lineHeight: 1.1 }}>
                {account.currentPoints?.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Transit Points</div>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <StatsCard
              title="Current Points Balance"
              value={`${account.currentPoints} pts`}
              icon={<Award size={24} />}
              color="secondary"
            />
            <StatsCard
              title="Lifetime Points Earned"
              value={`${account.totalEarned} pts`}
              icon={<PlusCircle size={24} />}
              color="primary"
            />
            <StatsCard
              title="Total Points Redeemed"
              value={`${account.totalRedeemed} pts`}
              icon={<Gift size={24} />}
              color="warning"
            />
            <StatsCard
              title="Next Tier Target"
              value={account.tierLevel === 'PLATINUM' ? 'MAX TIER' : '500 pts'}
              icon={<Award size={24} />}
              color="success"
            />
          </div>

          {/* Recent Activity Mini Ledger */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)' }}>
                Recent Points Activity
              </h3>
              <Link to="/rewards/history" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View Full Ledger <ArrowRight size={14} />
              </Link>
            </div>

            {recentTxns.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent points transactions recorded.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Points</th>
                      <th>Description</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTxns.map((t) => (
                      <tr key={t.id}>
                        <td>
                          <span className={`badge badge-${t.transactionType === 'EARNED' ? 'success' : 'warning'}`}>
                            {t.transactionType}
                          </span>
                        </td>
                        <td style={{ fontWeight: 700, color: t.transactionType === 'EARNED' ? '#059669' : '#DC2626' }}>
                          {t.transactionType === 'EARNED' ? `+${t.points}` : `-${t.points}`}
                        </td>
                        <td>{t.description}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {t.transactionDate ? new Date(t.transactionDate).toLocaleDateString() : 'Recent'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No loyalty account found for this customer profile.
        </div>
      )}

      {/* Grant Bonus Modal */}
      <Modal
        isOpen={isBonusModalOpen}
        onClose={() => setIsBonusModalOpen(false)}
        title="Credit Promotional Bonus Points"
      >
        <form onSubmit={handleGrantBonus}>
          <div className="form-group">
            <label className="form-label">Points to Credit</label>
            <input
              type="number"
              min="10"
              step="10"
              className="form-control"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reason / Promotion Campaign</label>
            <input
              type="text"
              className="form-control"
              value={bonusDesc}
              onChange={(e) => setBonusDesc(e.target.value)}
              required
              placeholder="e.g. New Route Promotional Gift"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsBonusModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Credit Points Now
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerRewardsPage;
