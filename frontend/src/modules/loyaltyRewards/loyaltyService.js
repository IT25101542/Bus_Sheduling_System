import axiosClient from '../../api/axiosClient';

export const loyaltyService = {
  // Programs
  getAllPrograms: () => axiosClient.get('/rewards/programs'),
  getProgramById: (id) => axiosClient.get(`/rewards/programs/${id}`),
  createProgram: (data) => axiosClient.post('/rewards/programs', data),
  updateProgram: (id, data) => axiosClient.put(`/rewards/programs/${id}`, data),
  deleteProgram: (id) => axiosClient.delete(`/rewards/programs/${id}`),

  // Customer Account
  getCustomerAccount: (customerId) => axiosClient.get(`/rewards/account/${customerId}`),
  redeemReward: (data) => axiosClient.post('/rewards/redeem', data),
  addPoints: (customerId, points, description) =>
    axiosClient.post('/rewards/points/add', null, { params: { customerId, points, description } }),

  // History / Ledger
  getCustomerHistory: (customerId) => axiosClient.get(`/rewards/history/${customerId}`),
  getAllHistory: () => axiosClient.get('/rewards/history'),
};

export default loyaltyService;
