import axiosClient from '../../api/axiosClient';

export const eventTransportService = {
  // Events
  getAllEvents: () => axiosClient.get('/events'),
  getEventById: (id) => axiosClient.get(`/events/${id}`),
  createEvent: (data) => axiosClient.post('/events', data),
  updateEvent: (id, data) => axiosClient.put(`/events/${id}`, data),
  deleteEvent: (id) => axiosClient.delete(`/events/${id}`),

  // Event Trips
  getTripsByEvent: (eventId) => axiosClient.get(`/events/${eventId}/trips`),
  createEventTrip: (eventId, data) => axiosClient.post(`/events/${eventId}/trips`, data),
  deleteEventTrip: (tripId) => axiosClient.delete(`/events/trips/${tripId}`),

  // Passengers
  getPassengersByEvent: (eventId) => axiosClient.get(`/events/${eventId}/passengers`),
  registerPassenger: (eventId, data) => axiosClient.post(`/events/${eventId}/passengers`, data),
  updatePassenger: (passengerId, data) => axiosClient.put(`/events/passengers/${passengerId}`, data),
  removePassenger: (passengerId) => axiosClient.delete(`/events/passengers/${passengerId}`),
  toggleCheckIn: (passengerId) => axiosClient.patch(`/events/passengers/${passengerId}/check-in`),

  // Reports
  getEventReport: (eventId) => axiosClient.get(`/events/${eventId}/reports`),
  getAllEventReports: () => axiosClient.get('/events/reports/all'),
};

export default eventTransportService;
