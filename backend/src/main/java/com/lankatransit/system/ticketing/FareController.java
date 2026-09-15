package com.lankatransit.system.ticketing;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fares")
public class FareController {

    private final TicketingService ticketingService;

    public FareController(TicketingService ticketingService) {
        this.ticketingService = ticketingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FareRuleDto>>> getAllFareRules() {
        return ResponseEntity.ok(ApiResponse.ok("Fare rules retrieved", ticketingService.getAllFareRules()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FareRuleDto>> getFareRuleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Fare rule retrieved", ticketingService.getFareRuleById(id)));
    }

    @GetMapping("/calculate")
    public ResponseEntity<ApiResponse<Double>> calculateFare(
            @RequestParam Long routeId,
            @RequestParam(defaultValue = "ADULT") String passengerType,
            @RequestParam(defaultValue = "LUXURY_AC") String busType) {
        double fare = ticketingService.calculateFare(routeId, passengerType, busType);
        return ResponseEntity.ok(ApiResponse.ok("Calculated fare", fare));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<FareRuleDto>> createFareRule(@Valid @RequestBody FareRuleDto dto) {
        FareRuleDto created = ticketingService.createFareRule(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Fare rule created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<FareRuleDto>> updateFareRule(@PathVariable Long id, @Valid @RequestBody FareRuleDto dto) {
        FareRuleDto updated = ticketingService.updateFareRule(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Fare rule updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFareRule(@PathVariable Long id) {
        ticketingService.deleteFareRule(id);
        return ResponseEntity.ok(ApiResponse.ok("Fare rule deleted successfully", null));
    }
}
