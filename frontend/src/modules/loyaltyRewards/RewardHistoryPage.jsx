import React, { useState, useEffect } from 'react';
import loyaltyService from './loyaltyService';
import Badge from '../../components/Badge';
import { useAuth } from '../../auth/AuthContext';
import { History, Search, ArrowDownLeft, ArrowUpRight, AlertCircle } from 'lucide-react';

export const RewardHistoryPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const customerId = user?.customerId || 1;

  const loadHistory = async () => {
    setLoading(true);
    try {
      let res;
      if (user?.role === 'CUSTOMER') {
        res = await loyaltyService.getCustomerHistory(customerId);
      } else {
        res = await loyaltyService.getAllHistory();
      }
      const list = res.data || [];
      setHistory(list);
      setFilteredHistory(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  useEffect(() => {
    let list = history;
    if (typeFilter !== 'ALL') {
      list = list.filter(item => item.transactionType === typeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        item =>
          item.description?.toLowerCase().includes(q) ||
          item.customerName?.toLowerCase().includes(q)
      );
    }
    setFilteredHistory(list);
  }, [searchQuery, typeFilter, history]);

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Points Activity Ledger</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Immutable audit record of all earned travel points and voucher deductions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-control"
            style={{ width: '150px' }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="EARNED">Earned Only</option>
            <option value="REDEEMED">Redeemed Only</option>
          </select>

          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2rem', width: '220px' }}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading transactions...</div>
        ) : filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <History size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No loyalty transactions found</p>
            <p>Points will appear here after booking bus trips or redeeming vouchers.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Action Type</th>
                  <th>Points</th>
                  <th>Description / Campaign</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  const isEarned = item.transactionType === 'EARNED';
                  return (
                    <tr key={item.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-color)' }}>
                        #TXN-{item.id}
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.customerName || 'Customer #' + item.customerId}</td>
                      <td>
                        <span
                          className={`badge ${isEarned ? 'badge-success' : 'badge-warning'}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          {isEarned ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {item.transactionType}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '1rem',
                            color: isEarned ? '#059669' : '#DC2626'
                          }}
                        >
                          {isEarned ? `+${item.points}` : `-${item.points}`} pts
                        </span>
                      </td>
                      <td>{item.description}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {item.transactionDate ? new Date(item.transactionDate).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardHistoryPage;
