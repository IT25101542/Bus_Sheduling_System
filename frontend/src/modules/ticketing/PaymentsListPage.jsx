import React, { useState, useEffect } from 'react';
import ticketingService from './ticketingService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { CreditCard, Printer, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const PaymentsListPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Receipt Modal
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await ticketingService.getPayments();
      setPayments(res.data || []);
      setFilteredPayments(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPayments(payments);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPayments(
        payments.filter(
          (p) =>
            p.transactionRef?.toLowerCase().includes(q) ||
            p.receiptNumber?.toLowerCase().includes(q) ||
            p.passengerName?.toLowerCase().includes(q) ||
            p.bookingReference?.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, payments]);

  const handleOpenReceipt = (payment) => {
    setSelectedPayment(payment);
    setIsReceiptOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Payments & Billing Records</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive audit log of credit card, debit card, and cash fare settlements.
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search payment or txn ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2rem', width: '260px' }}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading payment records...</div>
        ) : filteredPayments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <CreditCard size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>No payment records found</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Transaction Ref</th>
                  <th>Receipt #</th>
                  <th>Booking Ref</th>
                  <th>Passenger</th>
                  <th>Payment Method</th>
                  <th>Amount (LKR)</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-color)' }}>
                      {p.transactionRef}
                    </td>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {p.receiptNumber}
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>
                      {p.bookingReference || 'N/A'}
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.passengerName || 'Walk-in Passenger'}</td>
                    <td>
                      <span className="badge badge-info">{p.paymentMethod}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>
                      LKR {p.amount?.toFixed(2)}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}
                    </td>
                    <td>
                      <Badge variant={p.paymentStatus === 'COMPLETED' ? 'success' : 'danger'}>
                        {p.paymentStatus}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={() => handleOpenReceipt(p)}
                      >
                        <Printer size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Payment Receipt"
      >
        {selectedPayment && (
          <div>
            <div
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#FFFFFF',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                  LANKA TRANSIT SERVICES (PVT) LTD
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Official Payment & Fare Settlement Voucher
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Receipt #: </span>
                  <strong>{selectedPayment.receiptNumber}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Txn Ref: </span>
                  <strong style={{ fontFamily: 'monospace' }}>{selectedPayment.transactionRef}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                  <strong>{selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleString() : 'Recent'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Method: </span>
                  <strong>{selectedPayment.paymentMethod}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Passenger: </span>
                  <strong>{selectedPayment.passengerName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Booking Ref: </span>
                  <strong>{selectedPayment.bookingReference}</strong>
                </div>
              </div>

              <div style={{ borderTop: '2px dashed #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Settled:</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#059669' }}>
                  LKR {selectedPayment.amount?.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsReceiptOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrint}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentsListPage;
