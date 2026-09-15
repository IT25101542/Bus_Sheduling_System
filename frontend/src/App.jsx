import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Core Public Pages
import HomePage from './pages/HomePage';
import SearchTripsPage from './pages/SearchTripsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Trip Planning & Scheduling
import SchedulesPage from './modules/tripPlanning/SchedulesPage';
import RoutesPage from './modules/tripPlanning/RoutesPage';
import BusesPage from './modules/tripPlanning/BusesPage';
import DriversPage from './modules/tripPlanning/DriversPage';
import DelaysPage from './modules/tripPlanning/DelaysPage';

// Reservation Management
import ReservationsPage from './modules/reservation/ReservationsPage';
import WaitingListPage from './modules/reservation/WaitingListPage';

// Ticketing & Fare Management
import FareManagementPage from './modules/ticketing/FareManagementPage';
import TicketsListPage from './modules/ticketing/TicketsListPage';
import PaymentsListPage from './modules/ticketing/PaymentsListPage';
import RefundsPage from './modules/ticketing/RefundsPage';
import TicketingReportsPage from './modules/ticketing/TicketingReportsPage';

// Loyalty Rewards Management
import RewardProgramsPage from './modules/loyaltyRewards/RewardProgramsPage';
import CustomerRewardsPage from './modules/loyaltyRewards/CustomerRewardsPage';
import RedeemRewardsPage from './modules/loyaltyRewards/RedeemRewardsPage';
import RewardHistoryPage from './modules/loyaltyRewards/RewardHistoryPage';

// Customer Service Management
import ComplaintsPage from './modules/customerService/ComplaintsPage';
import SupportRequestsPage from './modules/customerService/SupportRequestsPage';
import FeedbackPage from './modules/customerService/FeedbackPage';
import NotificationsPage from './modules/customerService/NotificationsPage';

// Special Event Transport Management
import EventsListPage from './modules/eventTransport/EventsListPage';
import EventTripsPage from './modules/eventTransport/EventTripsPage';
import EventPassengersPage from './modules/eventTransport/EventPassengersPage';
import EventReportsPage from './modules/eventTransport/EventReportsPage';

// Role Groups
const TRIP_PLANNING_ROLES = [
  'OPERATIONS_MANAGER', 
  'TRANSPORT_PLANNING_OFFICER', 
  'BUS_DEPOT_SUPERVISOR', 
  'SYSTEM_ADMIN'
];

const FINANCE_ROLES = [
  'FINANCE_ADMIN', 
  'SYSTEM_ADMIN'
];

const EVENT_ROLES = [
  'OPERATIONS_MANAGER', 
  'BUS_DEPOT_SUPERVISOR', 
  'SYSTEM_ADMIN'
];

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Flow */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchTripsPage />} />
          </Route>

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Workspace */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            {/* Unified Role Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Trip Planning Routes (Staff Only) */}
            <Route path="/trip-planning/schedules" element={
              <ProtectedRoute allowedRoles={TRIP_PLANNING_ROLES}><SchedulesPage /></ProtectedRoute>
            } />
            <Route path="/trip-planning/routes" element={
              <ProtectedRoute allowedRoles={TRIP_PLANNING_ROLES}><RoutesPage /></ProtectedRoute>
            } />
            <Route path="/trip-planning/buses" element={
              <ProtectedRoute allowedRoles={TRIP_PLANNING_ROLES}><BusesPage /></ProtectedRoute>
            } />
            <Route path="/trip-planning/drivers" element={
              <ProtectedRoute allowedRoles={TRIP_PLANNING_ROLES}><DriversPage /></ProtectedRoute>
            } />
            <Route path="/trip-planning/delays" element={
              <ProtectedRoute allowedRoles={TRIP_PLANNING_ROLES}><DelaysPage /></ProtectedRoute>
            } />

            {/* Reservation Management Routes */}
            <Route path="/reservations" element={<ReservationsPage />} />
            <Route path="/waiting-list" element={<WaitingListPage />} />

            {/* Ticketing & Fare Management Routes */}
            <Route path="/ticketing/fares" element={
              <ProtectedRoute allowedRoles={FINANCE_ROLES}><FareManagementPage /></ProtectedRoute>
            } />
            <Route path="/ticketing/tickets" element={<TicketsListPage />} />
            <Route path="/ticketing/payments" element={
              <ProtectedRoute allowedRoles={FINANCE_ROLES}><PaymentsListPage /></ProtectedRoute>
            } />
            <Route path="/ticketing/refunds" element={
              <ProtectedRoute allowedRoles={FINANCE_ROLES}><RefundsPage /></ProtectedRoute>
            } />
            <Route path="/ticketing/reports" element={
              <ProtectedRoute allowedRoles={FINANCE_ROLES}><TicketingReportsPage /></ProtectedRoute>
            } />

            {/* Loyalty Rewards Routes */}
            <Route path="/rewards/programs" element={
              <ProtectedRoute allowedRoles={FINANCE_ROLES}><RewardProgramsPage /></ProtectedRoute>
            } />
            <Route path="/rewards/points" element={<CustomerRewardsPage />} />
            <Route path="/rewards/redeem" element={<RedeemRewardsPage />} />
            <Route path="/rewards/history" element={<RewardHistoryPage />} />

            {/* Customer Service Routes */}
            <Route path="/customer-service/complaints" element={<ComplaintsPage />} />
            <Route path="/customer-service/support" element={<SupportRequestsPage />} />
            <Route path="/customer-service/feedback" element={<FeedbackPage />} />
            <Route path="/customer-service/notifications" element={<NotificationsPage />} />

            {/* Event Transport Routes (Staff Only) */}
            <Route path="/events" element={
              <ProtectedRoute allowedRoles={EVENT_ROLES}><EventsListPage /></ProtectedRoute>
            } />
            <Route path="/events/trips" element={
              <ProtectedRoute allowedRoles={EVENT_ROLES}><EventTripsPage /></ProtectedRoute>
            } />
            <Route path="/events/passengers" element={
              <ProtectedRoute allowedRoles={EVENT_ROLES}><EventPassengersPage /></ProtectedRoute>
            } />
            <Route path="/events/reports" element={
              <ProtectedRoute allowedRoles={EVENT_ROLES}><EventReportsPage /></ProtectedRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
