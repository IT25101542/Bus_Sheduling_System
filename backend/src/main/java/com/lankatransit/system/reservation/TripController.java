package com.lankatransit.system.reservation;

import com.lankatransit.system.common.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final ReservationService reservationService;

    public TripController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TripDto>>> searchTrips(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TripDto> results = reservationService.searchTrips(origin, destination, date);
        return ResponseEntity.ok(ApiResponse.ok("Trips retrieved", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDto>> getTripWithSeats(@PathVariable Long id) {
        TripDto trip = reservationService.getTripDetailsWithSeats(id);
        return ResponseEntity.ok(ApiResponse.ok("Trip details retrieved", trip));
    }

    @GetMapping("/{id}/alternatives")
    public ResponseEntity<ApiResponse<List<TripDto>>> getAlternativeTrips(@PathVariable Long id) {
        List<TripDto> alternatives = reservationService.getAlternativeTrips(id);
        return ResponseEntity.ok(ApiResponse.ok("Alternative trips retrieved", alternatives));
    }
}
