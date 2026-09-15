import axiosClient from '../../api/axiosClient';

export const reservationService = {
  // Trips & Search
  getTrips: (params) => axiosClient.get('/trips', { params }),
  getTripWithSeats: (id) => axiosClient.get(`/trips/${id}`),
  getAlternativeTrips: (id) => axiosClient.get(`/trips/${id}/alternatives`),

  // Reservations
  getReservations: (customerId) => axiosClient.get('/reservations', { params: { customerId } }),
  getReservationById: (id) => axiosClient.get(`/reservations/${id}`),
  createReservation: (data) => axiosClient.post('/reservations', data),
  modifyReservation: (id, params) => axiosClient.put(`/reservations/${id}`, null, { params }),
  cancelReservation: (id) => axiosClient.delete(`/reservations/${id}`),

  // Waiting List
  getWaitingList: () => axiosClient.get('/waiting-list'),
  addToWaitingList: (data) => axiosClient.post('/waiting-list', data),
  removeFromWaitingList: (id) => axiosClient.delete(`/waiting-list/${id}`),
};

export default reservationService;
