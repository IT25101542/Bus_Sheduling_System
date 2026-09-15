import axiosClient from '../../api/axiosClient';

export const customerService = {
  // Complaints
  getComplaints: (customerId) => axiosClient.get('/complaints', { params: { customerId } }),
  getComplaintById: (id) => axiosClient.get(`/complaints/${id}`),
  createComplaint: (data) => axiosClient.post('/complaints', data),
  updateComplaintStatus: (id, status, resolutionNotes) =>
    axiosClient.put(`/complaints/${id}/status`, null, { params: { status, resolutionNotes } }),
  deleteComplaint: (id) => axiosClient.delete(`/complaints/${id}`),

  // Support Requests
  getSupportRequests: (customerId) => axiosClient.get('/support-requests', { params: { customerId } }),
  createSupportRequest: (data) => axiosClient.post('/support-requests', data),
  respondSupportRequest: (id, response, status) =>
    axiosClient.put(`/support-requests/${id}/respond`, null, { params: { response, status } }),
  deleteSupportRequest: (id) => axiosClient.delete(`/support-requests/${id}`),

  // Feedback
  getFeedbacks: (tripId) => axiosClient.get('/feedbacks', { params: { tripId } }),
  createFeedback: (data) => axiosClient.post('/feedbacks', data),
  deleteFeedback: (id) => axiosClient.delete(`/feedbacks/${id}`),

  // Notifications
  getNotifications: (recipientId) => axiosClient.get('/notifications', { params: { recipientId } }),
  sendNotification: (data) => axiosClient.post('/notifications', data),
  markNotificationRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  deleteNotification: (id) => axiosClient.delete(`/notifications/${id}`),
};

export default customerService;
