import axiosClient from '../../api/axiosClient';

export const tripPlanningService = {
  // Schedules
  getSchedules: () => axiosClient.get('/schedules'),
  getScheduleById: (id) => axiosClient.get(`/schedules/${id}`),
  createSchedule: (data) => axiosClient.post('/schedules', data),
  updateSchedule: (id, data) => axiosClient.put(`/schedules/${id}`, data),
  deleteSchedule: (id) => axiosClient.delete(`/schedules/${id}`),

  // Routes
  getRoutes: () => axiosClient.get('/routes'),
  getRouteById: (id) => axiosClient.get(`/routes/${id}`),
  createRoute: (data) => axiosClient.post('/routes', data),
  updateRoute: (id, data) => axiosClient.put(`/routes/${id}`, data),
  deleteRoute: (id) => axiosClient.delete(`/routes/${id}`),

  // Buses
  getBuses: () => axiosClient.get('/buses'),
  getBusById: (id) => axiosClient.get(`/buses/${id}`),
  createBus: (data) => axiosClient.post('/buses', data),
  updateBus: (id, data) => axiosClient.put(`/buses/${id}`, data),
  deleteBus: (id) => axiosClient.delete(`/buses/${id}`),

  // Drivers
  getDrivers: () => axiosClient.get('/drivers'),
  getDriverById: (id) => axiosClient.get(`/drivers/${id}`),
  createDriver: (data) => axiosClient.post('/drivers', data),
  updateDriver: (id, data) => axiosClient.put(`/drivers/${id}`, data),
  deleteDriver: (id) => axiosClient.delete(`/drivers/${id}`),

  // Delays
  getDelays: () => axiosClient.get('/delays'),
  logDelay: (data) => axiosClient.post('/delays', data),
  deleteDelay: (id) => axiosClient.delete(`/delays/${id}`),
};

export default tripPlanningService;
