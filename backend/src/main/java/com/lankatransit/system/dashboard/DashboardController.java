package com.lankatransit.system.dashboard;

import com.lankatransit.system.auth.Customer;
import com.lankatransit.system.auth.CustomerRepository;
import com.lankatransit.system.auth.UserRepository;
import com.lankatransit.system.common.ApiResponse;
import com.lankatransit.system.customerservice.ComplaintRepository;
import com.lankatransit.system.customerservice.NotificationRepository;
import com.lankatransit.system.eventtransport.TransportEventRepository;
import com.lankatransit.system.loyalty.RewardAccountRepository;
import com.lankatransit.system.reservation.ReservationRepository;
import com.lankatransit.system.reservation.TripRepository;
import com.lankatransit.system.ticketing.Payment;
import com.lankatransit.system.ticketing.PaymentRepository;
import com.lankatransit.system.ticketing.TicketRepository;
import com.lankatransit.system.tripplanning.BusRepository;
import com.lankatransit.system.tripplanning.DriverRepository;
import com.lankatransit.system.tripplanning.RouteRepository;
import com.lankatransit.system.tripplanning.ScheduleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final ScheduleRepository scheduleRepository;
    private final TripRepository tripRepository;
    private final ReservationRepository reservationRepository;
    private final TicketRepository ticketRepository;
    private final PaymentRepository paymentRepository;
    private final RewardAccountRepository rewardAccountRepository;
    private final ComplaintRepository complaintRepository;
    private final NotificationRepository notificationRepository;
    private final TransportEventRepository eventRepository;

    public DashboardController(UserRepository userRepository,
                               CustomerRepository customerRepository,
                               BusRepository busRepository,
                               DriverRepository driverRepository,
                               RouteRepository routeRepository,
                               ScheduleRepository scheduleRepository,
                               TripRepository tripRepository,
                               ReservationRepository reservationRepository,
                               TicketRepository ticketRepository,
                               PaymentRepository paymentRepository,
                               RewardAccountRepository rewardAccountRepository,
                               ComplaintRepository complaintRepository,
                               NotificationRepository notificationRepository,
                               TransportEventRepository eventRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.scheduleRepository = scheduleRepository;
        this.tripRepository = tripRepository;
        this.reservationRepository = reservationRepository;
        this.ticketRepository = ticketRepository;
        this.paymentRepository = paymentRepository;
        this.rewardAccountRepository = rewardAccountRepository;
        this.complaintRepository = complaintRepository;
        this.notificationRepository = notificationRepository;
        this.eventRepository = eventRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(
            @RequestParam(required = false) Long customerId,
            Authentication authentication) {

        Map<String, Object> stats = new HashMap<>();

        // Overall System Metrics
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBuses", busRepository.count());
        stats.put("totalDrivers", driverRepository.count());
        stats.put("totalRoutes", routeRepository.count());
        stats.put("totalSchedules", scheduleRepository.count());
        stats.put("totalTrips", tripRepository.count());
        stats.put("totalReservations", reservationRepository.count());
        stats.put("totalTickets", ticketRepository.count());
        stats.put("totalEvents", eventRepository.count());

        double totalRevenue = paymentRepository.findAll().stream().mapToDouble(Payment::getAmount).sum();
        stats.put("totalRevenue", totalRevenue);

        long activeBuses = busRepository.findByStatus("ACTIVE").size();
        stats.put("activeBuses", activeBuses);

        long openComplaints = complaintRepository.findByStatus("OPEN").size();
        stats.put("openComplaints", openComplaints);

        // Customer Specific (if passed)
        if (customerId != null) {
            stats.put("myReservationsCount", reservationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).size());
            stats.put("myTicketsCount", ticketRepository.findByCustomerIdOrderByIssueDateDesc(customerId).size());
            stats.put("myComplaintsCount", complaintRepository.findByCustomerIdOrderBySubmittedAtDesc(customerId).size());

            rewardAccountRepository.findByCustomerId(customerId).ifPresent(acc -> {
                stats.put("myPoints", acc.getCurrentPoints());
                stats.put("myTier", acc.getTierLevel());
            });
        }

        return ResponseEntity.ok(ApiResponse.ok("Dashboard statistics retrieved", stats));
    }
}
