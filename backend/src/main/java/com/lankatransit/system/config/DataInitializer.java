package com.lankatransit.system.config;

import com.lankatransit.system.auth.Customer;
import com.lankatransit.system.auth.CustomerRepository;
import com.lankatransit.system.auth.User;
import com.lankatransit.system.auth.UserRepository;
import com.lankatransit.system.common.Role;
import com.lankatransit.system.customerservice.*;
import com.lankatransit.system.eventtransport.*;
import com.lankatransit.system.loyalty.*;
import com.lankatransit.system.reservation.*;
import com.lankatransit.system.ticketing.*;
import com.lankatransit.system.tripplanning.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    // Member 1
    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;
    private final RouteStopRepository routeStopRepository;
    private final ScheduleRepository scheduleRepository;

    // Member 2
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;

    // Member 3
    private final FareRuleRepository fareRuleRepository;
    private final TicketRepository ticketRepository;
    private final PaymentRepository paymentRepository;

    // Member 4
    private final RewardProgramRepository rewardProgramRepository;
    private final RewardAccountRepository rewardAccountRepository;
    private final RewardTransactionRepository rewardTransactionRepository;

    // Member 5
    private final ComplaintRepository complaintRepository;
    private final SupportRequestRepository supportRequestRepository;
    private final FeedbackRepository feedbackRepository;
    private final NotificationRepository notificationRepository;

    // Member 6
    private final TransportEventRepository eventRepository;
    private final EventTripRepository eventTripRepository;
    private final EventPassengerRepository eventPassengerRepository;

    public DataInitializer(UserRepository userRepository,
                           CustomerRepository customerRepository,
                           PasswordEncoder passwordEncoder,
                           BusRepository busRepository,
                           DriverRepository driverRepository,
                           RouteRepository routeRepository,
                           RouteStopRepository routeStopRepository,
                           ScheduleRepository scheduleRepository,
                           TripRepository tripRepository,
                           SeatRepository seatRepository,
                           ReservationRepository reservationRepository,
                           FareRuleRepository fareRuleRepository,
                           TicketRepository ticketRepository,
                           PaymentRepository paymentRepository,
                           RewardProgramRepository rewardProgramRepository,
                           RewardAccountRepository rewardAccountRepository,
                           RewardTransactionRepository rewardTransactionRepository,
                           ComplaintRepository complaintRepository,
                           SupportRequestRepository supportRequestRepository,
                           FeedbackRepository feedbackRepository,
                           NotificationRepository notificationRepository,
                           TransportEventRepository eventRepository,
                           EventTripRepository eventTripRepository,
                           EventPassengerRepository eventPassengerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
        this.routeRepository = routeRepository;
        this.routeStopRepository = routeStopRepository;
        this.scheduleRepository = scheduleRepository;
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
        this.reservationRepository = reservationRepository;
        this.fareRuleRepository = fareRuleRepository;
        this.ticketRepository = ticketRepository;
        this.paymentRepository = paymentRepository;
        this.rewardProgramRepository = rewardProgramRepository;
        this.rewardAccountRepository = rewardAccountRepository;
        this.rewardTransactionRepository = rewardTransactionRepository;
        this.complaintRepository = complaintRepository;
        this.supportRequestRepository = supportRequestRepository;
        this.feedbackRepository = feedbackRepository;
        this.notificationRepository = notificationRepository;
        this.eventRepository = eventRepository;
        this.eventTripRepository = eventTripRepository;
        this.eventPassengerRepository = eventPassengerRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println("Initializing Lanka Transit Services database with sample demonstration data...");

        // 1. Users
        User admin = userRepository.save(new User("admin", "admin@lankatransit.lk", passwordEncoder.encode("Admin@123"), "System Administrator", "+94 77 100 0001", Role.SYSTEM_ADMIN));
        User planner = userRepository.save(new User("planner", "planner@lankatransit.lk", passwordEncoder.encode("Planner@123"), "Hemantha Abeysinghe", "+94 77 200 0002", Role.TRANSPORT_PLANNING_OFFICER));
        User supervisor = userRepository.save(new User("supervisor", "supervisor@lankatransit.lk", passwordEncoder.encode("Supervisor@123"), "Gayashan Nimjaya", "+94 77 300 0003", Role.CUSTOMER_SERVICE_SUPERVISOR));
        User finance = userRepository.save(new User("finance", "finance@lankatransit.lk", passwordEncoder.encode("Finance@123"), "Kasun Perera", "+94 77 400 0004", Role.FINANCE_ADMIN));
        User ops = userRepository.save(new User("opsmanager", "opsmanager@lankatransit.lk", passwordEncoder.encode("Ops@123"), "Ilakkiya Sivakumaran", "+94 77 500 0005", Role.OPERATIONS_MANAGER));
        User depot = userRepository.save(new User("depot", "depot@lankatransit.lk", passwordEncoder.encode("Depot@123"), "Nimal Jayakody", "+94 77 600 0006", Role.BUS_DEPOT_SUPERVISOR));
        User customerUser = userRepository.save(new User("customer", "customer@lankatransit.lk", passwordEncoder.encode("Customer@123"), "Nuwan Berugoda", "+94 71 889 9123", Role.CUSTOMER));

        Customer customer = customerRepository.save(new Customer(customerUser, "200112345678", "No. 45, Galle Road, Colombo 03", "GOLD"));

        // 2. Member 1: Buses & Drivers
        Bus bus1 = busRepository.save(new Bus("BUS-001", "ND-4521", 40, "LUXURY_AC", "ACTIVE", "Colombo Fort Central Depot", true));
        Bus bus2 = busRepository.save(new Bus("BUS-002", "ND-7712", 40, "HIGHWAY_EXPRESS", "ACTIVE", "Makumbura Multimodal Hub", true));
        Bus bus3 = busRepository.save(new Bus("BUS-003", "NB-8890", 44, "SEMI_LUXURY", "ACTIVE", "Kandy Depot", false));
        Bus bus4 = busRepository.save(new Bus("BUS-004", "NA-3310", 40, "LUXURY_AC", "ACTIVE", "Galle Bus Depot", true));
        Bus bus5 = busRepository.save(new Bus("BUS-005", "NC-9041", 40, "LUXURY_AC", "ACTIVE", "Nuwara Eliya Depot", true));
        Bus bus6 = busRepository.save(new Bus("BUS-006", "WP-GA-1122", 36, "SUPER_LUXURY", "ACTIVE", "Jaffna Central Terminal", true));
        Bus bus7 = busRepository.save(new Bus("BUS-007", "NC-6677", 40, "LUXURY_AC", "ACTIVE", "Anuradhapura Depot", true));
        Bus bus8 = busRepository.save(new Bus("BUS-008", "EP-4433", 40, "LUXURY_AC", "ACTIVE", "Trincomalee Depot", true));
        Bus bus9 = busRepository.save(new Bus("BUS-009", "UP-5511", 44, "SEMI_LUXURY", "ACTIVE", "Badulla / Ella Depot", false));
        Bus bus10 = busRepository.save(new Bus("BUS-010", "WP-ND-9901", 35, "HIGHWAY_EXPRESS", "ACTIVE", "Katunayake Airport Hub", true));

        Driver drv1 = driverRepository.save(new Driver("DRV-001", "Sunil Wickramasinghe", "B8849201", "+94 77 441 2301", "AVAILABLE", "Colombo Fort Central Depot"));
        Driver drv2 = driverRepository.save(new Driver("DRV-002", "Mahesh Priyantha", "B3392102", "+94 76 552 3412", "AVAILABLE", "Makumbura Multimodal Hub"));
        Driver drv3 = driverRepository.save(new Driver("DRV-003", "Roshan Dissanayake", "B9912043", "+94 71 663 4523", "AVAILABLE", "Kandy Depot"));
        Driver drv4 = driverRepository.save(new Driver("DRV-004", "Anura Kumara Silva", "B1123954", "+94 78 774 5634", "AVAILABLE", "Galle Bus Depot"));
        Driver drv5 = driverRepository.save(new Driver("DRV-005", "Chaminda Bandara", "B4477265", "+94 70 885 6745", "AVAILABLE", "Colombo Fort Central Depot"));
        Driver drv6 = driverRepository.save(new Driver("DRV-006", "K. Ratnam", "B5521980", "+94 77 912 3456", "AVAILABLE", "Jaffna Central Terminal"));
        Driver drv7 = driverRepository.save(new Driver("DRV-007", "P. Herath", "B6612091", "+94 71 823 4567", "AVAILABLE", "Anuradhapura Depot"));
        Driver drv8 = driverRepository.save(new Driver("DRV-008", "S. Mohamed", "B7734102", "+94 76 734 5678", "AVAILABLE", "Trincomalee Depot"));
        Driver drv9 = driverRepository.save(new Driver("DRV-009", "N. Jayawardena", "B8845213", "+94 75 645 6789", "AVAILABLE", "Badulla / Ella Depot"));
        Driver drv10 = driverRepository.save(new Driver("DRV-010", "K. Fernando", "B9956324", "+94 78 556 7890", "AVAILABLE", "Katunayake Airport Hub"));

        // Routes & Return Routes
        Route r1 = routeRepository.save(new Route("EX-01", "Colombo (Makumbura)", "Galle", 118.0, 90, 850.0));
        Route r1r = routeRepository.save(new Route("EX-01R", "Galle", "Colombo (Makumbura)", 118.0, 90, 850.0));

        Route r2 = routeRepository.save(new Route("RT-01", "Colombo (Fort)", "Kandy", 115.0, 180, 650.0));
        Route r2r = routeRepository.save(new Route("RT-01R", "Kandy", "Colombo (Fort)", 115.0, 180, 650.0));

        Route r3 = routeRepository.save(new Route("RT-05", "Colombo (Fort)", "Kurunegala", 94.0, 150, 550.0));
        Route r3r = routeRepository.save(new Route("RT-05R", "Kurunegala", "Colombo (Fort)", 94.0, 150, 550.0));

        Route r4 = routeRepository.save(new Route("EX-02", "Colombo (Makumbura)", "Matara", 160.0, 120, 1100.0));
        Route r4r = routeRepository.save(new Route("EX-02R", "Matara", "Colombo (Makumbura)", 160.0, 120, 1100.0));

        Route r5 = routeRepository.save(new Route("RT-87", "Colombo (Fort)", "Jaffna", 395.0, 450, 2400.0));
        Route r5r = routeRepository.save(new Route("RT-87R", "Jaffna", "Colombo (Fort)", 395.0, 450, 2400.0));

        Route r6 = routeRepository.save(new Route("RT-57", "Colombo (Fort)", "Anuradhapura", 205.0, 270, 950.0));
        Route r6r = routeRepository.save(new Route("RT-57R", "Anuradhapura", "Colombo (Fort)", 205.0, 270, 950.0));

        Route r7 = routeRepository.save(new Route("RT-99", "Colombo (Fort)", "Badulla", 230.0, 360, 1250.0));
        Route r7r = routeRepository.save(new Route("RT-99R", "Badulla", "Colombo (Fort)", 230.0, 360, 1250.0));

        Route r8 = routeRepository.save(new Route("RT-49", "Colombo (Fort)", "Trincomalee", 260.0, 330, 1600.0));
        Route r8r = routeRepository.save(new Route("RT-49R", "Trincomalee", "Colombo (Fort)", 260.0, 330, 1600.0));

        Route r9 = routeRepository.save(new Route("EX-03", "Colombo (Fort)", "Negombo", 35.0, 45, 450.0));
        Route r9r = routeRepository.save(new Route("EX-03R", "Negombo", "Colombo (Fort)", 35.0, 45, 450.0));

        Route r10 = routeRepository.save(new Route("RT-79", "Colombo (Fort)", "Nuwara Eliya", 165.0, 300, 1100.0));
        Route r10r = routeRepository.save(new Route("RT-79R", "Nuwara Eliya", "Colombo (Fort)", 165.0, 300, 1100.0));

        Route r11 = routeRepository.save(new Route("EX-04", "Colombo (Makumbura)", "Hambantota", 220.0, 165, 1450.0));
        Route r11r = routeRepository.save(new Route("EX-04R", "Hambantota", "Colombo (Makumbura)", 220.0, 165, 1450.0));

        // Key Route Stops
        routeStopRepository.save(new RouteStop(r1, "Makumbura Multimodal Hub", 1, 0.0));
        routeStopRepository.save(new RouteStop(r1, "Dodangoda Interchange", 2, 45.0));
        routeStopRepository.save(new RouteStop(r1, "Galle Central Bus Stand", 3, 118.0));

        routeStopRepository.save(new RouteStop(r1r, "Galle Central Bus Stand", 1, 0.0));
        routeStopRepository.save(new RouteStop(r1r, "Dodangoda Interchange", 2, 73.0));
        routeStopRepository.save(new RouteStop(r1r, "Makumbura Multimodal Hub", 3, 118.0));

        routeStopRepository.save(new RouteStop(r2, "Colombo Fort Bus Stand", 1, 0.0));
        routeStopRepository.save(new RouteStop(r2, "Nittambuwa", 2, 40.0));
        routeStopRepository.save(new RouteStop(r2, "Kegalle", 3, 78.0));
        routeStopRepository.save(new RouteStop(r2, "Kandy Goods Shed", 4, 115.0));

        routeStopRepository.save(new RouteStop(r2r, "Kandy Goods Shed", 1, 0.0));
        routeStopRepository.save(new RouteStop(r2r, "Kegalle", 2, 37.0));
        routeStopRepository.save(new RouteStop(r2r, "Nittambuwa", 3, 75.0));
        routeStopRepository.save(new RouteStop(r2r, "Colombo Fort Bus Stand", 4, 115.0));

        // Schedules
        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now().plusMonths(6);

        Schedule s1 = scheduleRepository.save(new Schedule("SCH-EX01-0700", r1, bus2, drv2, "07:00", "08:30", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s2 = scheduleRepository.save(new Schedule("SCH-EX01-1630", r1, bus2, drv2, "16:30", "18:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s1r = scheduleRepository.save(new Schedule("SCH-EX01R-1000", r1r, bus2, drv2, "10:00", "11:30", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s2r = scheduleRepository.save(new Schedule("SCH-EX01R-1900", r1r, bus2, drv2, "19:00", "20:30", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s3 = scheduleRepository.save(new Schedule("SCH-RT01-0630", r2, bus1, drv1, "06:30", "09:30", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s4 = scheduleRepository.save(new Schedule("SCH-RT01-1400", r2, bus1, drv1, "14:00", "17:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s3r = scheduleRepository.save(new Schedule("SCH-RT01R-1100", r2r, bus1, drv1, "11:00", "14:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s4r = scheduleRepository.save(new Schedule("SCH-RT01R-1800", r2r, bus1, drv1, "18:00", "21:00", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s5 = scheduleRepository.save(new Schedule("SCH-RT05-0800", r3, bus3, drv3, "08:00", "10:30", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s5r = scheduleRepository.save(new Schedule("SCH-RT05R-1300", r3r, bus3, drv3, "13:00", "15:30", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s6 = scheduleRepository.save(new Schedule("SCH-EX02-0900", r4, bus4, drv4, "09:00", "11:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s6r = scheduleRepository.save(new Schedule("SCH-EX02R-1430", r4r, bus4, drv4, "14:30", "16:30", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s7 = scheduleRepository.save(new Schedule("SCH-RT87-2100", r5, bus6, drv6, "21:00", "05:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s7r = scheduleRepository.save(new Schedule("SCH-RT87R-2130", r5r, bus6, drv6, "21:30", "05:30", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s8 = scheduleRepository.save(new Schedule("SCH-RT57-0730", r6, bus7, drv7, "07:30", "12:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s8r = scheduleRepository.save(new Schedule("SCH-RT57R-1400", r6r, bus7, drv7, "14:00", "18:30", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s9 = scheduleRepository.save(new Schedule("SCH-RT99-0600", r7, bus9, drv9, "06:00", "12:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s9r = scheduleRepository.save(new Schedule("SCH-RT99R-1300", r7r, bus9, drv9, "13:00", "19:00", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s10 = scheduleRepository.save(new Schedule("SCH-RT49-0630", r8, bus8, drv8, "06:30", "12:00", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s10r = scheduleRepository.save(new Schedule("SCH-RT49R-1430", r8r, bus8, drv8, "14:30", "20:00", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s11 = scheduleRepository.save(new Schedule("SCH-EX03-0800", r9, bus10, drv10, "08:00", "08:45", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s11r = scheduleRepository.save(new Schedule("SCH-EX03R-1100", r9r, bus10, drv10, "11:00", "11:45", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s12 = scheduleRepository.save(new Schedule("SCH-RT79-0630", r10, bus5, drv5, "06:30", "11:30", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s12r = scheduleRepository.save(new Schedule("SCH-RT79R-1330", r10r, bus5, drv5, "13:30", "18:30", "DAILY", "ACTIVE", startDate, endDate));

        Schedule s13 = scheduleRepository.save(new Schedule("SCH-EX04-0830", r11, bus4, drv4, "08:30", "11:15", "DAILY", "ACTIVE", startDate, endDate));
        Schedule s13r = scheduleRepository.save(new Schedule("SCH-EX04R-1500", r11r, bus4, drv4, "15:00", "17:45", "DAILY", "ACTIVE", startDate, endDate));

        // 3. Member 2: Trips & Seats (104 Scheduled Departures across 4 days)
        LocalDate today = LocalDate.now();
        Trip t1 = null;
        Trip t3 = null;

        for (int i = 0; i <= 3; i++) {
            LocalDate tripDate = today.plusDays(i);
            String dateCode = tripDate.toString().replace("-", "");

            Trip tr1 = tripRepository.save(new Trip("TRP-" + dateCode + "-01", s1, r1, bus2, drv2, tripDate, "07:00", "08:30", 850.0, 40));
            if (i == 0) t1 = tr1;
            tripRepository.save(new Trip("TRP-" + dateCode + "-02", s2, r1, bus2, drv2, tripDate, "16:30", "18:00", 850.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-03", s1r, r1r, bus2, drv2, tripDate, "10:00", "11:30", 850.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-04", s2r, r1r, bus2, drv2, tripDate, "19:00", "20:30", 850.0, 40));

            Trip tr5 = tripRepository.save(new Trip("TRP-" + dateCode + "-05", s3, r2, bus1, drv1, tripDate, "06:30", "09:30", 650.0, 40));
            if (i == 0) t3 = tr5;
            tripRepository.save(new Trip("TRP-" + dateCode + "-06", s4, r2, bus1, drv1, tripDate, "14:00", "17:00", 650.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-07", s3r, r2r, bus1, drv1, tripDate, "11:00", "14:00", 650.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-08", s4r, r2r, bus1, drv1, tripDate, "18:00", "21:00", 650.0, 40));

            tripRepository.save(new Trip("TRP-" + dateCode + "-09", s5, r3, bus3, drv3, tripDate, "08:00", "10:30", 550.0, 44));
            tripRepository.save(new Trip("TRP-" + dateCode + "-10", s5r, r3r, bus3, drv3, tripDate, "13:00", "15:30", 550.0, 44));

            tripRepository.save(new Trip("TRP-" + dateCode + "-11", s6, r4, bus4, drv4, tripDate, "09:00", "11:00", 1100.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-12", s6r, r4r, bus4, drv4, tripDate, "14:30", "16:30", 1100.0, 40));

            tripRepository.save(new Trip("TRP-" + dateCode + "-13", s7, r5, bus6, drv6, tripDate, "21:00", "05:00", 2400.0, 36));
            tripRepository.save(new Trip("TRP-" + dateCode + "-14", s7r, r5r, bus6, drv6, tripDate, "21:30", "05:30", 2400.0, 36));

            tripRepository.save(new Trip("TRP-" + dateCode + "-15", s8, r6, bus7, drv7, tripDate, "07:30", "12:00", 950.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-16", s8r, r6r, bus7, drv7, tripDate, "14:00", "18:30", 950.0, 40));

            tripRepository.save(new Trip("TRP-" + dateCode + "-17", s9, r7, bus9, drv9, tripDate, "06:00", "12:00", 1250.0, 44));
            tripRepository.save(new Trip("TRP-" + dateCode + "-18", s9r, r7r, bus9, drv9, tripDate, "13:00", "19:00", 1250.0, 44));

            tripRepository.save(new Trip("TRP-" + dateCode + "-19", s10, r8, bus8, drv8, tripDate, "06:30", "12:00", 1600.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-20", s10r, r8r, bus8, drv8, tripDate, "14:30", "20:00", 1600.0, 40));

            tripRepository.save(new Trip("TRP-" + dateCode + "-21", s11, r9, bus10, drv10, tripDate, "08:00", "08:45", 450.0, 35));
            tripRepository.save(new Trip("TRP-" + dateCode + "-22", s11r, r9r, bus10, drv10, tripDate, "11:00", "11:45", 450.0, 35));

            tripRepository.save(new Trip("TRP-" + dateCode + "-23", s12, r10, bus5, drv5, tripDate, "06:30", "11:30", 1100.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-24", s12r, r10r, bus5, drv5, tripDate, "13:30", "18:30", 1100.0, 40));

            tripRepository.save(new Trip("TRP-" + dateCode + "-25", s13, r11, bus4, drv4, tripDate, "08:30", "11:15", 1450.0, 40));
            tripRepository.save(new Trip("TRP-" + dateCode + "-26", s13r, r11r, bus4, drv4, tripDate, "15:00", "17:45", 1450.0, 40));
        }

        // Create seats for Trip 1
        List<Seat> t1Seats = new ArrayList<>();
        char[] cols = {'A', 'B', 'C', 'D'};
        for (int r = 1; r <= 10; r++) {
            for (char c : cols) {
                String sNum = r + "" + c;
                if (sNum.equals("1A")) {
                    t1Seats.add(new Seat(t1, sNum, "BOOKED"));
                } else if (sNum.equals("1B")) {
                    t1Seats.add(new Seat(t1, sNum, "BOOKED"));
                } else {
                    t1Seats.add(new Seat(t1, sNum, "AVAILABLE"));
                }
            }
        }
        seatRepository.saveAll(t1Seats);
        t1.setAvailableSeats(38);
        tripRepository.save(t1);

        // Reservation & Ticket & Payment
        Reservation res1 = reservationRepository.save(new Reservation("LT-RES-88901", t1, customer, "Nuwan Berugoda", "+94 71 889 9123", "200112345678", "1A", 850.0));
        Ticket tkt1 = ticketRepository.save(new Ticket("TKT-2026-001", res1, t1, customer, "Nuwan Berugoda", "1A", 850.0, "QR_LT_RES_88901_1A"));
        paymentRepository.save(new Payment("TXN-20260913-8891", res1, tkt1, 850.0, "CREDIT_CARD", "COMPLETED", "RCPT-2026-001"));

        // 4. Member 3: Fare Rules
        fareRuleRepository.save(new FareRule("Standard Adult Highway Fare", r1, "ADULT", "HIGHWAY_EXPRESS", 300.0, 4.66, 0.0, true));
        fareRuleRepository.save(new FareRule("Child Expressway Fare (50% Off)", r1, "CHILD", "HIGHWAY_EXPRESS", 150.0, 2.33, 50.0, true));
        fareRuleRepository.save(new FareRule("Student Concession Kandy Route", r2, "STUDENT", "LUXURY_AC", 200.0, 3.50, 25.0, true));
        fareRuleRepository.save(new FareRule("Senior Citizen Welfare Fare", r2, "SENIOR", "LUXURY_AC", 200.0, 3.50, 30.0, true));

        // 5. Member 4: Loyalty Programs & Accounts
        rewardProgramRepository.save(new RewardProgram("Bronze Explorer", 100, 1.0, 5.0, "Entry level tier earning 1 point per Rs. 100 spent", true));
        rewardProgramRepository.save(new RewardProgram("Silver Voyager", 500, 1.25, 10.0, "Mid tier offering 10% discount vouchers and priority seat selection", true));
        rewardProgramRepository.save(new RewardProgram("Gold Commuter", 1000, 1.5, 15.0, "Premium commuter tier with 15% travel savings and express support", true));
        rewardProgramRepository.save(new RewardProgram("Platinum Elite", 2500, 2.0, 25.0, "Top tier VIP perks with complimentary seat upgrades and zero cancellation fees", true));

        RewardAccount rwdAcc = rewardAccountRepository.save(new RewardAccount(customer, 650, 850, 200, "SILVER"));
        rewardTransactionRepository.save(new RewardTransaction(rwdAcc, "BONUS", 200, "Welcome registration reward bonus"));
        rewardTransactionRepository.save(new RewardTransaction(rwdAcc, "EARNED", 650, "Trip points earned for Colombo to Galle express booking"));

        // 6. Member 5: Customer Service
        complaintRepository.save(new Complaint("CMP-2026-001", customer, "BUS_CONDITION", "Air conditioning temperature too low", "The AC was set excessively cold on the 07:00 Colombo-Galle bus without adjustment.", t1.getTripCode()));
        Complaint cmpResolved = new Complaint("CMP-2026-002", customer, "SCHEDULE_DELAY", "15 min departure delay at Fort", "Departure was delayed due to luggage loading delay.", t3.getTripCode());
        cmpResolved.setStatus("RESOLVED");
        cmpResolved.setResolutionNotes("Depot supervisor instructed loaders to adhere strictly to 5 min boarding cutoff.");
        cmpResolved.setResolvedAt(LocalDateTime.now().minusDays(1));
        complaintRepository.save(cmpResolved);

        supportRequestRepository.save(new SupportRequest("SUP-2026-101", customer, "Inquiry on luggage weight limit", "LOW", "What is the maximum allowed baggage weight for the highway luxury express bus?"));
        feedbackRepository.save(new Feedback(customer, t1, 5, "Smooth, punctual journey along the Southern expressway. Very clean bus!"));

        notificationRepository.save(new Notification(customerUser.getId(), "CUSTOMER", "Booking Confirmed", "Your booking LT-RES-88901 for seat 1A is confirmed. Safe travels!", "INFO"));
        notificationRepository.save(new Notification(customerUser.getId(), "CUSTOMER", "Special Promo", "Earn 2x Loyalty Points on all Southern Expressway trips this weekend!", "PROMOTION"));

        // 7. Member 6: Event Transport
        TransportEvent event1 = eventRepository.save(new TransportEvent(
                "SLIIT National Tech Symposium 2026",
                "EXCURSION",
                "Faculty of Computing",
                "+94 77 912 3456",
                today.plusDays(10),
                today.plusDays(11),
                "SLIIT Malabe Campus",
                "BMICH Colombo",
                2,
                80
        ));
        TransportEvent event2 = eventRepository.save(new TransportEvent(
                "Southern Corporate Leadership Summit",
                "CORPORATE",
                "Apex Lanka Holdings",
                "+94 71 334 5566",
                today.plusDays(20),
                today.plusDays(20),
                "Colombo Fort",
                "Jetwing Lighthouse Galle",
                1,
                40
        ));

        EventTrip evTrip1 = eventTripRepository.save(new EventTrip(event1, bus1, drv1, today.plusDays(10), "07:30", "18:00"));
        eventPassengerRepository.save(new EventPassenger(event1, evTrip1, "Dr. Nuwan Kodagoda", "+94 77 111 2233", "+94 77 999 8877", "1A"));
        eventPassengerRepository.save(new EventPassenger(event1, evTrip1, "Prof. Koliya Pulasinghe", "+94 77 222 3344", "+94 77 888 7766", "1B"));

        System.out.println("Lanka Transit Services sample database initialized successfully!");
    }
}
