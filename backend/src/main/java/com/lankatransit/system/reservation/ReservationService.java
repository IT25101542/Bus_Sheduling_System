package com.lankatransit.system.reservation;

import com.lankatransit.system.auth.Customer;
import com.lankatransit.system.auth.CustomerRepository;
import com.lankatransit.system.exception.BadRequestException;
import com.lankatransit.system.exception.ConflictException;
import com.lankatransit.system.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final ReservationRepository reservationRepository;
    private final WaitingListRepository waitingListRepository;
    private final CustomerRepository customerRepository;

    public ReservationService(TripRepository tripRepository,
                              SeatRepository seatRepository,
                              ReservationRepository reservationRepository,
                              WaitingListRepository waitingListRepository,
                              CustomerRepository customerRepository) {
        this.tripRepository = tripRepository;
        this.seatRepository = seatRepository;
        this.reservationRepository = reservationRepository;
        this.waitingListRepository = waitingListRepository;
        this.customerRepository = customerRepository;
    }

    // ==========================================
    // TRIP SEARCH & DETAILS
    // ==========================================
    public List<TripDto> searchTrips(String origin, String destination, LocalDate tripDate) {
        List<Trip> allTrips = tripRepository.findAll();
        List<Trip> filtered = allTrips.stream()
                .filter(t -> {
                    if (origin != null && !origin.trim().isEmpty()) {
                        String o = origin.trim().toLowerCase();
                        if (t.getRoute() == null || t.getRoute().getOrigin() == null ||
                                !t.getRoute().getOrigin().toLowerCase().contains(o)) {
                            return false;
                        }
                    }
                    if (destination != null && !destination.trim().isEmpty()) {
                        String d = destination.trim().toLowerCase();
                        if (t.getRoute() == null || t.getRoute().getDestination() == null ||
                                !t.getRoute().getDestination().toLowerCase().contains(d)) {
                            return false;
                        }
                    }
                    if (tripDate != null) {
                        if (t.getTripDate() == null || !t.getTripDate().equals(tripDate)) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());

        // Fallback 1: If route specified but no trips on this exact date, show all available dates for that route
        if (filtered.isEmpty() && ((origin != null && !origin.trim().isEmpty()) || (destination != null && !destination.trim().isEmpty()))) {
            filtered = allTrips.stream()
                    .filter(t -> {
                        if (origin != null && !origin.trim().isEmpty()) {
                            String o = origin.trim().toLowerCase();
                            if (t.getRoute() == null || t.getRoute().getOrigin() == null ||
                                    !t.getRoute().getOrigin().toLowerCase().contains(o)) {
                                return false;
                            }
                        }
                        if (destination != null && !destination.trim().isEmpty()) {
                            String d = destination.trim().toLowerCase();
                            if (t.getRoute() == null || t.getRoute().getDestination() == null ||
                                    !t.getRoute().getDestination().toLowerCase().contains(d)) {
                                return false;
                            }
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        // Note: If no trips match the search criteria, filtered will remain empty
        // so the frontend can properly display "No trips found" instead of displaying wrong routes.

        return filtered.stream().map(this::mapToTripDto).collect(Collectors.toList());
    }

    public List<TripDto> getAllTrips() {
        return tripRepository.findAll().stream().map(this::mapToTripDto).collect(Collectors.toList());
    }

    @Transactional
    public TripDto getTripDetailsWithSeats(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + tripId));

        ensureSeatsInitialized(trip);

        List<Seat> seats = seatRepository.findByTripIdOrderBySeatNumberAsc(tripId);
        TripDto dto = mapToTripDto(trip);
        dto.setSeats(seats.stream().map(s -> new SeatDto(s.getId(), s.getSeatNumber(), s.getSeatStatus(), s.getPassengerName())).collect(Collectors.toList()));
        return dto;
    }

    @Transactional
    public synchronized void ensureSeatsInitialized(Trip trip) {
        List<Seat> existing = seatRepository.findByTripIdOrderBySeatNumberAsc(trip.getId());
        if (existing.isEmpty()) {
            List<Seat> seatsToSave = new ArrayList<>();
            // Standard 2x2 layout: 10 rows (1A, 1B, 1C, 1D ... 10A, 10B, 10C, 10D)
            char[] cols = {'A', 'B', 'C', 'D'};
            for (int r = 1; r <= 10; r++) {
                for (char c : cols) {
                    seatsToSave.add(new Seat(trip, r + "" + c, "AVAILABLE"));
                }
            }
            seatRepository.saveAll(seatsToSave);
        }
    }

    // ==========================================
    // RESERVATION CRUD & DOUBLE-BOOKING PREVENTION
    // ==========================================
    public List<ReservationDto> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToReservationDto)
                .collect(Collectors.toList());
    }

    public List<ReservationDto> getReservationsByCustomer(Long customerId) {
        return reservationRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToReservationDto)
                .collect(Collectors.toList());
    }

    public ReservationDto getReservationById(Long id) {
        Reservation res = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return mapToReservationDto(res);
    }

    @Transactional
    public synchronized ReservationDto bookSeat(ReservationRequest req) {
        Trip trip = tripRepository.findById(req.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + req.getTripId()));

        if (trip.getAvailableSeats() <= 0) {
            throw new BadRequestException("Trip is completely full. Please join the waiting list or select an alternative scheduled trip.");
        }

        ensureSeatsInitialized(trip);

        Seat seat = seatRepository.findByTripIdAndSeatNumber(trip.getId(), req.getSeatNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Seat " + req.getSeatNumber() + " does not exist on this trip."));

        // Critical business rule: Prevent double booking of same seat
        if (!"AVAILABLE".equalsIgnoreCase(seat.getSeatStatus())) {
            throw new ConflictException("Seat " + req.getSeatNumber() + " is already booked by another customer. Please choose a different seat.");
        }

        Customer customer = null;
        if (req.getCustomerId() != null) {
            customer = customerRepository.findById(req.getCustomerId()).orElse(null);
        }

        // Lock the seat
        seat.setSeatStatus("BOOKED");
        seat.setPassengerName(req.getPassengerName());
        seatRepository.save(seat);

        // Decrement available seats
        trip.setAvailableSeats(Math.max(0, trip.getAvailableSeats() - 1));
        tripRepository.save(trip);

        // Create unique booking reference
        String bookingRef = "LT-RES-" + (10000 + (int)(Math.random() * 89999));

        Reservation reservation = new Reservation(
                bookingRef,
                trip,
                customer,
                req.getPassengerName(),
                req.getPassengerPhone(),
                req.getPassengerNic(),
                req.getSeatNumber(),
                trip.getFareAmount()
        );
        Reservation saved = reservationRepository.save(reservation);

        return mapToReservationDto(saved);
    }

    @Transactional
    public ReservationDto modifyReservation(Long id, String newSeatNumber, String newName, String newPhone) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));

        if ("CANCELLED".equalsIgnoreCase(reservation.getReservationStatus())) {
            throw new BadRequestException("Cannot modify a cancelled reservation.");
        }

        if (newName != null && !newName.trim().isEmpty()) {
            reservation.setPassengerName(newName);
        }
        if (newPhone != null && !newPhone.trim().isEmpty()) {
            reservation.setPassengerPhone(newPhone);
        }

        // If changing seat
        if (newSeatNumber != null && !newSeatNumber.equalsIgnoreCase(reservation.getSeatNumber())) {
            Seat oldSeat = seatRepository.findByTripIdAndSeatNumber(reservation.getTrip().getId(), reservation.getSeatNumber()).orElse(null);
            Seat newSeat = seatRepository.findByTripIdAndSeatNumber(reservation.getTrip().getId(), newSeatNumber)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat " + newSeatNumber + " does not exist."));

            if (!"AVAILABLE".equalsIgnoreCase(newSeat.getSeatStatus())) {
                throw new ConflictException("New seat " + newSeatNumber + " is already booked.");
            }

            if (oldSeat != null) {
                oldSeat.setSeatStatus("AVAILABLE");
                oldSeat.setPassengerName(null);
                seatRepository.save(oldSeat);
            }

            newSeat.setSeatStatus("BOOKED");
            newSeat.setPassengerName(reservation.getPassengerName());
            seatRepository.save(newSeat);

            reservation.setSeatNumber(newSeatNumber);
            reservation.setReservationStatus("MODIFIED");
        }

        Reservation updated = reservationRepository.save(reservation);
        return mapToReservationDto(updated);
    }

    @Transactional
    public void cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + id));

        if ("CANCELLED".equalsIgnoreCase(reservation.getReservationStatus())) {
            return;
        }

        // Free up the seat
        Seat seat = seatRepository.findByTripIdAndSeatNumber(reservation.getTrip().getId(), reservation.getSeatNumber()).orElse(null);
        if (seat != null) {
            seat.setSeatStatus("AVAILABLE");
            seat.setPassengerName(null);
            seatRepository.save(seat);
        }

        Trip trip = reservation.getTrip();
        trip.setAvailableSeats(Math.min(trip.getTotalSeats(), trip.getAvailableSeats() + 1));
        tripRepository.save(trip);

        reservation.setReservationStatus("CANCELLED");
        reservationRepository.save(reservation);
    }

    // ==========================================
    // WAITING LIST CRUD & ALTERNATIVE TRIPS
    // ==========================================
    public List<WaitingListDto> getAllWaitingList() {
        return waitingListRepository.findAll().stream().map(this::mapToWaitingListDto).collect(Collectors.toList());
    }

    @Transactional
    public WaitingListDto addToWaitingList(WaitingListDto dto) {
        Trip trip = tripRepository.findById(dto.getTripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + dto.getTripId()));

        Customer customer = null;
        if (dto.getCustomerId() != null) {
            customer = customerRepository.findById(dto.getCustomerId()).orElse(null);
        }

        WaitingListEntry entry = new WaitingListEntry(
                trip,
                customer,
                dto.getPassengerName(),
                dto.getContactPhone(),
                dto.getRequestedSeats() > 0 ? dto.getRequestedSeats() : 1
        );
        WaitingListEntry saved = waitingListRepository.save(entry);
        return mapToWaitingListDto(saved);
    }

    @Transactional
    public void removeFromWaitingList(Long id) {
        WaitingListEntry entry = waitingListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waiting list entry not found: " + id));
        waitingListRepository.delete(entry);
    }

    public List<TripDto> getAlternativeTrips(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found: " + tripId));

        // Find other trips for the same route
        return tripRepository.findByRouteId(trip.getRoute().getId()).stream()
                .filter(t -> !t.getId().equals(tripId) && t.getAvailableSeats() > 0)
                .map(this::mapToTripDto)
                .collect(Collectors.toList());
    }

    // Mapping helpers
    private TripDto mapToTripDto(Trip t) {
        TripDto dto = new TripDto();
        dto.setId(t.getId());
        dto.setTripCode(t.getTripCode());
        dto.setScheduleId(t.getSchedule().getId());
        dto.setRouteId(t.getRoute().getId());
        dto.setRouteNumber(t.getRoute().getRouteNumber());
        dto.setOrigin(t.getRoute().getOrigin());
        dto.setDestination(t.getRoute().getDestination());
        dto.setBusNumber(t.getBus().getBusNumber());
        dto.setBusType(t.getBus().getBusType());
        dto.setDriverName(t.getDriver().getFullName());
        dto.setTripDate(t.getTripDate());
        dto.setDepartureTime(t.getDepartureTime());
        dto.setArrivalTime(t.getArrivalTime());
        dto.setFareAmount(t.getFareAmount());
        dto.setTotalSeats(t.getTotalSeats());
        dto.setAvailableSeats(t.getAvailableSeats());
        dto.setStatus(t.getStatus());
        return dto;
    }

    private ReservationDto mapToReservationDto(Reservation r) {
        ReservationDto dto = new ReservationDto();
        dto.setId(r.getId());
        dto.setBookingReference(r.getBookingReference());
        dto.setTripId(r.getTrip().getId());
        dto.setTripCode(r.getTrip().getTripCode());
        dto.setTripDate(r.getTrip().getTripDate());
        dto.setDepartureTime(r.getTrip().getDepartureTime());
        dto.setArrivalTime(r.getTrip().getArrivalTime());
        dto.setRouteName(r.getTrip().getRoute().getOrigin() + " -> " + r.getTrip().getRoute().getDestination());
        dto.setBusNumber(r.getTrip().getBus().getBusNumber());
        dto.setCustomerId(r.getCustomer() != null ? r.getCustomer().getId() : null);
        dto.setPassengerName(r.getPassengerName());
        dto.setPassengerPhone(r.getPassengerPhone());
        dto.setPassengerNic(r.getPassengerNic());
        dto.setSeatNumber(r.getSeatNumber());
        dto.setTotalAmount(r.getTotalAmount());
        dto.setReservationStatus(r.getReservationStatus());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    private WaitingListDto mapToWaitingListDto(WaitingListEntry w) {
        WaitingListDto dto = new WaitingListDto();
        dto.setId(w.getId());
        dto.setTripId(w.getTrip().getId());
        dto.setTripCode(w.getTrip().getTripCode());
        dto.setRouteName(w.getTrip().getRoute().getOrigin() + " -> " + w.getTrip().getRoute().getDestination());
        dto.setCustomerId(w.getCustomer() != null ? w.getCustomer().getId() : null);
        dto.setPassengerName(w.getPassengerName());
        dto.setContactPhone(w.getContactPhone());
        dto.setRequestedSeats(w.getRequestedSeats());
        dto.setStatus(w.getStatus());
        dto.setCreatedAt(w.getCreatedAt());
        return dto;
    }
}
