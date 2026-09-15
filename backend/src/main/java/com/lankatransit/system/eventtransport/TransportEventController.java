package com.lankatransit.system.eventtransport;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class TransportEventController {

    private final EventTransportService service;

    public TransportEventController(EventTransportService service) {
        this.service = service;
    }

    // Event CRUD
    @GetMapping
    public ResponseEntity<ApiResponse<List<TransportEventDto>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.ok("Events retrieved", service.getAllEvents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransportEventDto>> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Event retrieved", service.getEventById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OPERATIONS_MANAGER', 'BUS_DEPOT_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<TransportEventDto>> createEvent(@Valid @RequestBody TransportEventDto dto) {
        TransportEventDto created = service.createEvent(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Event created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATIONS_MANAGER', 'BUS_DEPOT_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<TransportEventDto>> updateEvent(@PathVariable Long id, @Valid @RequestBody TransportEventDto dto) {
        TransportEventDto updated = service.updateEvent(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Event updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        service.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.ok("Event deleted successfully", null));
    }

    // Event Trips
    @GetMapping("/{id}/trips")
    public ResponseEntity<ApiResponse<List<EventTripDto>>> getTripsByEvent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Event trips retrieved", service.getTripsByEvent(id)));
    }

    @PostMapping("/{id}/trips")
    @PreAuthorize("hasAnyRole('OPERATIONS_MANAGER', 'BUS_DEPOT_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<EventTripDto>> createEventTrip(@PathVariable Long id, @Valid @RequestBody EventTripDto dto) {
        dto.setEventId(id);
        EventTripDto created = service.createEventTrip(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Event trip scheduled successfully", created));
    }

    @DeleteMapping("/trips/{tripId}")
    @PreAuthorize("hasAnyRole('OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEventTrip(@PathVariable Long tripId) {
        service.deleteEventTrip(tripId);
        return ResponseEntity.ok(ApiResponse.ok("Event trip cancelled", null));
    }

    // Event Passengers
    @GetMapping("/{id}/passengers")
    public ResponseEntity<ApiResponse<List<EventPassengerDto>>> getPassengersByEvent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Passengers retrieved", service.getPassengersByEvent(id)));
    }

    @PostMapping("/{id}/passengers")
    public ResponseEntity<ApiResponse<EventPassengerDto>> registerPassenger(@PathVariable Long id, @Valid @RequestBody EventPassengerDto dto) {
        dto.setEventId(id);
        EventPassengerDto registered = service.registerPassenger(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Passenger registered successfully", registered));
    }

    @PutMapping("/passengers/{passengerId}")
    public ResponseEntity<ApiResponse<EventPassengerDto>> updatePassenger(@PathVariable Long passengerId, @Valid @RequestBody EventPassengerDto dto) {
        EventPassengerDto updated = service.updatePassenger(passengerId, dto);
        return ResponseEntity.ok(ApiResponse.ok("Passenger details updated", updated));
    }

    @DeleteMapping("/passengers/{passengerId}")
    public ResponseEntity<ApiResponse<Void>> removePassenger(@PathVariable Long passengerId) {
        service.removePassenger(passengerId);
        return ResponseEntity.ok(ApiResponse.ok("Passenger removed from event", null));
    }

    @PatchMapping("/passengers/{passengerId}/check-in")
    public ResponseEntity<ApiResponse<EventPassengerDto>> toggleCheckIn(@PathVariable Long passengerId) {
        EventPassengerDto updated = service.toggleCheckIn(passengerId);
        return ResponseEntity.ok(ApiResponse.ok("Check-in status toggled", updated));
    }

    // Event Reports
    @GetMapping("/{id}/reports")
    public ResponseEntity<ApiResponse<EventReportDto>> getEventReport(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Event report generated", service.getEventReport(id)));
    }

    @GetMapping("/reports/all")
    public ResponseEntity<ApiResponse<List<EventReportDto>>> getAllEventReports() {
        return ResponseEntity.ok(ApiResponse.ok("All event reports generated", service.getAllEventReports()));
    }
}
