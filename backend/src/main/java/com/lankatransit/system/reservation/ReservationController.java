package com.lankatransit.system.reservation;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReservationDto>>> getAllReservations(
            @RequestParam(required = false) Long customerId) {
        List<ReservationDto> list = (customerId != null)
                ? reservationService.getReservationsByCustomer(customerId)
                : reservationService.getAllReservations();
        return ResponseEntity.ok(ApiResponse.ok("Reservations retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationDto>> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Reservation retrieved", reservationService.getReservationById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReservationDto>> createReservation(@Valid @RequestBody ReservationRequest req) {
        ReservationDto created = reservationService.bookSeat(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Reservation confirmed successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationDto>> modifyReservation(
            @PathVariable Long id,
            @RequestParam(required = false) String newSeatNumber,
            @RequestParam(required = false) String passengerName,
            @RequestParam(required = false) String passengerPhone) {
        ReservationDto modified = reservationService.modifyReservation(id, newSeatNumber, passengerName, passengerPhone);
        return ResponseEntity.ok(ApiResponse.ok("Reservation modified successfully", modified));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.ok("Reservation cancelled successfully", null));
    }
}
