import React, { useState, useEffect } from 'react';
import ticketingService from './ticketingService';
import tripPlanningService from '../tripPlanning/tripPlanningService';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import { Tag, Plus, Edit2, Trash2, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const FareManagementPage = () => {
  const [fareRules, setFareRules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fare Rule Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    ruleName: '',
    routeId: '',
    passengerType: 'ADULT',
    busType: 'LUXURY_AC',
    basePrice: 500,
    perKmRate: 15,
    discountPercentage: 0,
    active: true
  });

  // Interactive Fare Simulator
  const [calcRouteId, setCalcRouteId] = useState('');
  const [calcPassengerType, setCalcPassengerType] = useState('ADULT');
  const [calcBusType, setCalcBusType] = useState('LUXURY_AC');
  const [simulatedFare, setSimulatedFare] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rulesRes, routesRes] = await Promise.all([
        ticketingService.getFareRules(),
        tripPlanningService.getRoutes()
      ]);
      setFareRules(rulesRes.data || []);
      const routeList = routesRes.data || [];
      setRoutes(routeList);
      if (routeList.length > 0 && !calcRouteId) {
        setCalcRouteId(routeList[0].id.toString());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingRule(null);
    setFormData({
      ruleName: '',
      routeId: routes[0]?.id || '',
      passengerType: 'ADULT',
      busType: 'LUXURY_AC',
      basePrice: 500,
      perKmRate: 15,
      discountPercentage: 0,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({
      ruleName: rule.ruleName,
      routeId: rule.routeId || '',
      passengerType: rule.passengerType,
      busType: rule.busType,
      basePrice: rule.basePrice,
      perKmRate: rule.perKmRate,
      discountPercentage: rule.discountPercentage,
      active: rule.active
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        routeId: formData.routeId ? parseInt(formData.routeId, 10) : null,
        basePrice: parseFloat(formData.basePrice),
        perKmRate: parseFloat(formData.perKmRate),
        discountPercentage: parseFloat(formData.discountPercentage)
      };

      if (editingRule) {
        await ticketingService.updateFareRule(editingRule.id, payload);
        setSuccess('Fare rule updated successfully!');
      } else {
        await ticketingService.createFareRule(payload);
        setSuccess('New fare rule created successfully!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fare rule?')) {
      try {
        await ticketingService.deleteFareRule(id);
        setSuccess('Fare rule deleted.');
        loadData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSimulateFare = async (e) => {
    e.preventDefault();
    if (!calcRouteId) return;
    setCalcLoading(true);
    try {
      const res = await ticketingService.calculateFare({
        routeId: calcRouteId,
        passengerType: calcPassengerType,
        busType: calcBusType
      });
      setSimulatedFare(res.data);
    } catch (err) {
      setError('Could not calculate fare for specified parameters: ' + err.message);
    } finally {
      setCalcLoading(false);
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

      {/* Dynamic Simulator Section */}
      <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Calculator size={20} color="var(--primary-color)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary-color)' }}>
            Live Dynamic Fare Calculation Engine
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Formula: <code style={{ backgroundColor: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>Total Fare = (Base Price + [Per KM Rate &times; Route Distance] &times; Bus Multiplier) &times; (1 - Discount%)</code>
        </p>

        <form onSubmit={handleSimulateFare} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Route</label>
            <select
              className="form-control"
              value={calcRouteId}
              onChange={(e) => setCalcRouteId(e.target.value)}
            >
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.routeNumber} ({r.originCity} - {r.destinationCity}, {r.distanceKm} km)</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Passenger Category</label>
            <select
              className="form-control"
              value={calcPassengerType}
              onChange={(e) => setCalcPassengerType(e.target.value)}
            >
              <option value="ADULT">Adult (Standard)</option>
              <option value="CHILD">Child (50% Off)</option>
              <option value="STUDENT">Student (20% Off)</option>
              <option value="SENIOR">Senior Citizen (15% Off)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Bus Comfort Class</label>
            <select
              className="form-control"
              value={calcBusType}
              onChange={(e) => setCalcBusType(e.target.value)}
            >
              <option value="SUPER_LUXURY">Super Luxury (1.5x)</option>
              <option value="LUXURY_AC">Luxury AC (1.2x)</option>
              <option value="SEMI_LUXURY">Semi-Luxury (1.0x)</option>
              <option value="NORMAL">Standard / Normal (0.8x)</option>
            </select>
          </div>

          <div>
            <button type="submit" className="btn btn-secondary" style={{ width: '100%' }} disabled={calcLoading}>
              {calcLoading ? 'Calculating...' : 'Simulate Rate'}
            </button>
          </div>
        </form>

        {simulatedFare !== null && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', backgroundColor: '#EFF6FF', borderRadius: '6px', border: '1px solid #BFDBFE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: 500 }}>
              Calculated Ticket Price for 1 Passenger:
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8' }}>
              LKR {simulatedFare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>Fare Configuration Rules</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage base pricing formulas, per-kilometer tariffs, and category concessions.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Fare Rule
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading fare rules...</div>
        ) : fareRules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No fare rules configured.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rule Name</th>
                  <th>Route Applicability</th>
                  <th>Passenger Group</th>
                  <th>Bus Class</th>
                  <th>Base Price (LKR)</th>
                  <th>Per KM (LKR)</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fareRules.map((rule) => (
                  <tr key={rule.id}>
                    <td style={{ fontWeight: 600 }}>{rule.ruleName}</td>
                    <td>{rule.routeName || 'Global (All Routes)'}</td>
                    <td>
                      <span className="badge badge-info">{rule.passengerType}</span>
                    </td>
                    <td>{rule.busType}</td>
                    <td style={{ fontWeight: 600 }}>LKR {rule.basePrice.toFixed(2)}</td>
                    <td>LKR {rule.perKmRate.toFixed(2)}</td>
                    <td>
                      {rule.discountPercentage > 0 ? (
                        <span style={{ color: '#059669', fontWeight: 600 }}>{rule.discountPercentage}% OFF</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>0%</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={rule.active ? 'success' : 'neutral'}>
                        {rule.active ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => handleOpenEditModal(rule)}
                          title="Edit Rule"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#DC2626', borderColor: '#FECACA' }}
                          onClick={() => handleDelete(rule.id)}
                          title="Delete Rule"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Fare Rule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? 'Edit Fare Configuration' : 'Create Fare Configuration'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Rule Title / Description</label>
            <input
              type="text"
              className="form-control"
              value={formData.ruleName}
              onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              required
              placeholder="e.g. Expressway Luxury AC Standard"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Specific Route (Leave blank for system-wide default)</label>
            <select
              className="form-control"
              value={formData.routeId}
              onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
            >
              <option value="">-- Apply to All Routes (Global) --</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.routeNumber} ({r.originCity} - {r.destinationCity})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Passenger Type</label>
              <select
                className="form-control"
                value={formData.passengerType}
                onChange={(e) => setFormData({ ...formData, passengerType: e.target.value })}
              >
                <option value="ADULT">Adult</option>
                <option value="CHILD">Child</option>
                <option value="STUDENT">Student</option>
                <option value="SENIOR">Senior Citizen</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bus Type</label>
              <select
                className="form-control"
                value={formData.busType}
                onChange={(e) => setFormData({ ...formData, busType: e.target.value })}
              >
                <option value="SUPER_LUXURY">Super Luxury</option>
                <option value="LUXURY_AC">Luxury AC</option>
                <option value="SEMI_LUXURY">Semi-Luxury</option>
                <option value="NORMAL">Standard / Normal</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Base Price (LKR)</label>
              <input
                type="number"
                step="10"
                min="0"
                className="form-control"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rate / KM (LKR)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-control"
                value={formData.perKmRate}
                onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount %</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                className="form-control"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <span style={{ fontWeight: 500 }}>Active Tariff Rule</span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FareManagementPage;
