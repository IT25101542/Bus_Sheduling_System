import React, { useState, useEffect } from 'react';
import loyaltyService from './loyaltyService';
import Modal from '../../components/Modal';
import { useAuth } from '../../auth/AuthContext';
import { Gift, Award, CheckCircle2, AlertCircle, Ticket, Coffee, Star, Zap } from 'lucide-react';

const REWARD_CATALOG = [
  {
    id: 'VOUCHER_10PCT',
    title: '10% Bus Fare Discount Voucher',
    points: 100,
    icon: <Ticket size={28} color="var(--primary-color)" />,
    description: 'Valid for any single journey booking across Southern and Central expressways.'
  },
  {
    id: 'AC_UPGRADE',
    title: 'Luxury AC Class Seat Upgrade',
    points: 150,
    icon: <Zap size={28} color="#F59E0B" />,
    description: 'Upgrade any standard semi-luxury reservation to air-conditioned comfort.'
  },
  {
    id: 'VOUCHER_25PCT',
    title: '25% Super Saver Travel Pass',
    points: 250,
    icon: <Star size={28} color="#10B981" />,
    description: 'Quarter discount applicable on long-distance Colombo-Jaffna / Batticaloa trips.'
  },
  {
    id: 'FREE_TICKET',
    title: '100% Free Intercity Bus Ticket',
    points: 500,
    icon: <Gift size={28} color="#8B5CF6" />,
    description: 'One full one-way ticket valid on any Lanka Transit scheduled departure.'
  },
  {
    id: 'SNACK_VOUCHER',
    title: 'Highway Rest-Stop Snack Voucher',
    points: 80,
    icon: <Coffee size={28} color="#D97706" />,
    description: 'Complimentary tea, coffee, and short-eats at Lanka Transit highway rest stations.'
  }
];

export const RedeemRewardsPage = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Redeem Confirmation Modal
  const [selectedReward, setSelectedReward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState(null);

  const customerId = user?.customerId || 1;

  const loadAccount = async () => {
    setLoading(true);
    try {
      const res = await loyaltyService.getCustomerAccount(customerId);
      setAccount(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, [user]);

  const handleOpenRedeemModal = (item) => {
    setSelectedReward(item);
    setRedeemedCode(null);
    setIsModalOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setError(null);
    try {
      await loyaltyService.redeemReward({
        customerId,
        points: selectedReward.points,
        rewardName: selectedReward.title
      });
      const generatedCode = 'LT-RWD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setRedeemedCode(generatedCode);
      setSuccess(`Congratulations! Redeemed ${selectedReward.title} for ${selectedReward.points} points.`);
      loadAccount();
    } catch (err) {
      setError(err.message);
      setIsModalOpen(false);
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

      {/* Points Balance Banner */}
      <div
        style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Award size={32} color="var(--primary-color)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-color)' }}>
              Redeemable Points Balance
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Account Holder: {account?.customerName || user?.fullName || 'Customer'}
            </span>
          </div>
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)' }}>
          {account ? `${account.currentPoints} pts` : 'Loading...'}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Rewards Catalog</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Select an available perk to redeem instantly using your earned travel points.
        </p>
      </div>

      {/* Reward Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {REWARD_CATALOG.map((item) => {
          const currentPts = account?.currentPoints || 0;
          const canAfford = currentPts >= item.points;

          return (
            <div
              key={item.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: canAfford ? '1px solid #E2E8F0' : '1px dashed #CBD5E1',
                opacity: canAfford ? 1 : 0.8
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '0.5rem', borderRadius: '8px' }}>
                    {item.icon}
                  </div>
                  <span
                    style={{
                      backgroundColor: canAfford ? '#FEF3C7' : '#F1F5F9',
                      color: canAfford ? '#92400E' : '#64748B',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '16px',
                      fontSize: '0.85rem'
                    }}
                  >
                    {item.points} Points
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {item.description}
                </p>
              </div>

              <button
                className={`btn ${canAfford ? 'btn-primary' : 'btn-outline'}`}
                disabled={!canAfford}
                onClick={() => handleOpenRedeemModal(item)}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                {canAfford ? (
                  <>
                    <Gift size={16} /> Redeem Reward
                  </>
                ) : (
                  `Need ${item.points - currentPts} more pts`
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={redeemedCode ? 'Voucher Generated!' : 'Confirm Points Redemption'}
      >
        {redeemedCode ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={56} color="#059669" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              Voucher Claimed Successfully!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Present this voucher reference during online checkout or at any Lanka Transit ticketing depot:
            </p>

            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '2px dashed var(--primary-color)',
                padding: '1rem',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: 'var(--primary-color)',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem'
              }}
            >
              {redeemedCode}
            </div>

            <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>
              Done & Return
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '1rem' }}>
              You are about to redeem <strong>{selectedReward?.points} points</strong> for:
            </p>
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                {selectedReward?.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {selectedReward?.description}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Remaining balance after redemption will be: <strong>{(account?.currentPoints || 0) - (selectedReward?.points || 0)} points</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleConfirmRedeem}>
                Confirm & Redeem
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RedeemRewardsPage;
