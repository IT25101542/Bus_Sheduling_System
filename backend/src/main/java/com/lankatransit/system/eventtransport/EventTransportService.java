package com.lankatransit.system.eventtransport;

import com.lankatransit.system.exception.BadRequestException;
import com.lankatransit.system.exception.ConflictException;
import com.lankatransit.system.exception.ResourceNotFoundException;
import com.lankatransit.system.tripplanning.Bus;
import com.lankatransit.system.tripplanning.BusRepository;
import com.lankatransit.system.tripplanning.Driver;
import com.lankatransit.system.tripplanning.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventTransportService {

    private final TransportEventRepository eventRepository;
    private final EventTripRepository eventTripRepository;
    private final EventPassengerRepository passengerRepository;
    private final BusRepository busRepository;
    private final DriverRepository driverRepository;

    public EventTransportService(TransportEventRepository eventRepository,
                                 EventTripRepository eventTripRepository,
                                 EventPassengerRepository passengerRepository,
                                 BusRepository busRepository,
                                 DriverRepository driverRepository) {
        this.eventRepository = eventRepository;
        this.eventTripRepository = eventTripRepository;
        this.passengerRepository = passengerRepository;
        this.busRepository = busRepository;
        this.driverRepository = driverRepository;
    }

    // ==========================================
    // EVENTS CRUD
    // ==========================================
    public List<TransportEventDto> getAllEvents() {
        return eventRepository.findAllByOrderByStartDateAsc().stream()
                .map(this::mapToEventDto)
                .collect(Collectors.toList());
    }

    public TransportEventDto getEventById(Long id) {
        TransportEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
        return mapToEventDto(event);
    }

    @Transactional
    public TransportEventDto createEvent(TransportEventDto dto) {
        TransportEvent event = new TransportEvent(
                dto.getEventName(),
                dto.getEventType() != null ? dto.getEventType() : "CORPORATE",
                dto.getOrganizerName(),
                dto.getContactPhone(),
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getOrigin(),
                dto.getDestination(),
                dto.getRequiredBuses() > 0 ? dto.getRequiredBuses() : 1,
                dto.getRequiredCapacity() > 0 ? dto.getRequiredCapacity() : 40
        );
        TransportEvent saved = eventRepository.save(event);
        return mapToEventDto(saved);
    }

    @Transactional
    public TransportEventDto updateEvent(Long id, TransportEventDto dto) {
        TransportEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));

        event.setEventName(dto.getEventName());
        event.setEventType(dto.getEventType());
        event.setOrganizerName(dto.getOrganizerName());
        event.setContactPhone(dto.getContactPhone());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setOrigin(dto.getOrigin());
        event.setDestination(dto.getDestination());
        event.setRequiredBuses(dto.getRequiredBuses());
        event.setRequiredCapacity(dto.getRequiredCapacity());
        if (dto.getStatus() != null) {
            event.setStatus(dto.getStatus());
        }

        TransportEvent saved = eventRepository.save(event);
        return mapToEventDto(saved);
    }

    @Transactional
    public void deleteEvent(Long id) {
        TransportEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
        eventRepository.delete(event);
    }

    // ==========================================
    // EVENT TRIPS & BUS AVAILABILITY CHECK
    // ==========================================
    public List<EventTripDto> getTripsByEvent(Long eventId) {
        return eventTripRepository.findByEventId(eventId).stream()
                .map(this::mapToEventTripDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventTripDto createEventTrip(EventTripDto dto) {
        TransportEvent event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + dto.getEventId()));

        Bus bus = busRepository.findById(dto.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found: " + dto.getBusId()));

        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found: " + dto.getDriverId()));

        // Business rule 1: Bus must be ACTIVE
        if (!"ACTIVE".equalsIgnoreCase(bus.getStatus())) {
            throw new BadRequestException("Cannot assign bus " + bus.getBusNumber()
                    + " (" + bus.getRegistrationNumber() + ") because its status is currently " + bus.getStatus());
        }

        // Business rule 2: Check bus not assigned to another event trip on the same day
        List<EventTrip> sameDayTrips = eventTripRepository.findByBusIdAndTripDate(bus.getId(), dto.getTripDate());
        if (!sameDayTrips.isEmpty()) {
            throw new ConflictException("Bus " + bus.getBusNumber() + " is already assigned to another event trip on " + dto.getTripDate());
        }

        EventTrip trip = new EventTrip(
                event,
                bus,
                driver,
                dto.getTripDate(),
                dto.getDepartureTime(),
                dto.getReturnTime()
        );
        EventTrip saved = eventTripRepository.save(trip);
        return mapToEventTripDto(saved);
    }

    @Transactional
    public void deleteEventTrip(Long id) {
        EventTrip trip = eventTripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event trip not found: " + id));
        eventTripRepository.delete(trip);
    }

    // ==========================================
    // EVENT PASSENGERS CRUD
    // ==========================================
    public List<EventPassengerDto> getPassengersByEvent(Long eventId) {
        return passengerRepository.findByEventId(eventId).stream()
                .map(this::mapToPassengerDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventPassengerDto registerPassenger(EventPassengerDto dto) {
        TransportEvent event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + dto.getEventId()));

        EventTrip trip = null;
        if (dto.getEventTripId() != null) {
            trip = eventTripRepository.findById(dto.getEventTripId()).orElse(null);
        }

        EventPassenger passenger = new EventPassenger(
                event,
                trip,
                dto.getPassengerName(),
                dto.getContactPhone(),
                dto.getEmergencyContact(),
                dto.getSeatAllocated()
        );
        EventPassenger saved = passengerRepository.save(passenger);
        return mapToPassengerDto(saved);
    }

    @Transactional
    public EventPassengerDto updatePassenger(Long id, EventPassengerDto dto) {
        EventPassenger p = passengerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found: " + id));

        p.setPassengerName(dto.getPassengerName());
        p.setContactPhone(dto.getContactPhone());
        p.setEmergencyContact(dto.getEmergencyContact());
        p.setSeatAllocated(dto.getSeatAllocated());
        p.setCheckInStatus(dto.isCheckInStatus());

        EventPassenger saved = passengerRepository.save(p);
        return mapToPassengerDto(saved);
    }

    @Transactional
    public void removePassenger(Long id) {
        EventPassenger p = passengerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found: " + id));
        passengerRepository.delete(p);
    }

    @Transactional
    public EventPassengerDto toggleCheckIn(Long id) {
        EventPassenger p = passengerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found: " + id));
        p.setCheckInStatus(!p.isCheckInStatus());
        return mapToPassengerDto(passengerRepository.save(p));
    }

    // ==========================================
    // EVENT REPORTS
    // ==========================================
    public EventReportDto getEventReport(Long eventId) {
        TransportEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        int assignedBuses = eventTripRepository.findByEventId(eventId).size();
        int totalPassengers = (int) passengerRepository.countByEventId(eventId);
        int checkedIn = (int) passengerRepository.countByEventIdAndCheckInStatusTrue(eventId);

        double rate = event.getRequiredCapacity() > 0 ? (totalPassengers * 100.0 / event.getRequiredCapacity()) : 0.0;

        EventReportDto dto = new EventReportDto();
        dto.setEventId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setEventType(event.getEventType());
        dto.setRequiredBuses(event.getRequiredBuses());
        dto.setAssignedBuses(assignedBuses);
        dto.setRequiredCapacity(event.getRequiredCapacity());
        dto.setTotalRegisteredPassengers(totalPassengers);
        dto.setCheckedInPassengers(checkedIn);
        dto.setUtilizationRate(Math.round(rate * 10.0) / 10.0);
        dto.setStatus(event.getStatus());
        return dto;
    }

    public List<EventReportDto> getAllEventReports() {
        return eventRepository.findAll().stream()
                .map(e -> getEventReport(e.getId()))
                .collect(Collectors.toList());
    }

    // Mapping helpers
    private TransportEventDto mapToEventDto(TransportEvent e) {
        TransportEventDto dto = new TransportEventDto();
        dto.setId(e.getId());
        dto.setEventName(e.getEventName());
        dto.setEventType(e.getEventType());
        dto.setOrganizerName(e.getOrganizerName());
        dto.setContactPhone(e.getContactPhone());
        dto.setStartDate(e.getStartDate());
        dto.setEndDate(e.getEndDate());
        dto.setOrigin(e.getOrigin());
        dto.setDestination(e.getDestination());
        dto.setRequiredBuses(e.getRequiredBuses());
        dto.setRequiredCapacity(e.getRequiredCapacity());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setAssignedBusesCount(eventTripRepository.findByEventId(e.getId()).size());
        dto.setRegisteredPassengersCount((int) passengerRepository.countByEventId(e.getId()));
        return dto;
    }

    private EventTripDto mapToEventTripDto(EventTrip t) {
        EventTripDto dto = new EventTripDto();
        dto.setId(t.getId());
        dto.setEventId(t.getEvent().getId());
        dto.setBusId(t.getBus().getId());
        dto.setBusNumber(t.getBus().getBusNumber() + " [" + t.getBus().getRegistrationNumber() + "]");
        dto.setBusType(t.getBus().getBusType());
        dto.setBusCapacity(t.getBus().getCapacity());
        dto.setDriverId(t.getDriver().getId());
        dto.setDriverName(t.getDriver().getFullName());
        dto.setTripDate(t.getTripDate());
        dto.setDepartureTime(t.getDepartureTime());
        dto.setReturnTime(t.getReturnTime());
        dto.setStatus(t.getStatus());
        return dto;
    }

    private EventPassengerDto mapToPassengerDto(EventPassenger p) {
        EventPassengerDto dto = new EventPassengerDto();
        dto.setId(p.getId());
        dto.setEventId(p.getEvent().getId());
        dto.setEventTripId(p.getEventTrip() != null ? p.getEventTrip().getId() : null);
        dto.setPassengerName(p.getPassengerName());
        dto.setContactPhone(p.getContactPhone());
        dto.setEmergencyContact(p.getEmergencyContact());
        dto.setSeatAllocated(p.getSeatAllocated());
        dto.setCheckInStatus(p.isCheckInStatus());
        dto.setBusNumber(p.getEventTrip() != null ? p.getEventTrip().getBus().getBusNumber() : "Unassigned");
        return dto;
    }
}
