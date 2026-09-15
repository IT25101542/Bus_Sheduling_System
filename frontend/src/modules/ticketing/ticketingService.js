import axiosClient from '../../api/axiosClient';

export const ticketingService = {
  // Fares
  getFareRules: () => axiosClient.get('/fares'),
  getFareRuleById: (id) => axiosClient.get(`/fares/${id}`),
  calculateFare: (params) => axiosClient.get('/fares/calculate', { params }),
  createFareRule: (data) => axiosClient.post('/fares', data),
  updateFareRule: (id, data) => axiosClient.put(`/fares/${id}`, data),
  deleteFareRule: (id) => axiosClient.delete(`/fares/${id}`),

  // Tickets
  getTickets: (customerId) => axiosClient.get('/tickets', { params: { customerId } }),
  getTicketById: (id) => axiosClient.get(`/tickets/${id}`),
  getTicketByReservation: (resId) => axiosClient.get(`/tickets/reservation/${resId}`),
  generateTicket: (reservationId) => axiosClient.post(`/tickets/generate/${reservationId}`),
  cancelTicket: (id) => axiosClient.delete(`/tickets/${id}`),

  // Payments
  getPayments: () => axiosClient.get('/payments'),
  processPayment: (data) => axiosClient.post('/payments', data),
  getFinancialReport: () => axiosClient.get('/payments/reports/financial'),

  // Refunds
  getRefunds: () => axiosClient.get('/refunds'),
  processRefund: (data) => axiosClient.post('/refunds', data),
};

export default ticketingService;
