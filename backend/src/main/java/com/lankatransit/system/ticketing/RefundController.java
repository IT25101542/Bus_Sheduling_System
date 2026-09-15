package com.lankatransit.system.ticketing;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {

    private final TicketingService ticketingService;

    public RefundController(TicketingService ticketingService) {
        this.ticketingService = ticketingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RefundDto>>> getAllRefunds() {
        return ResponseEntity.ok(ApiResponse.ok("Refunds retrieved", ticketingService.getAllRefunds()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RefundDto>> processRefund(@Valid @RequestBody RefundDto dto) {
        RefundDto refund = ticketingService.processRefund(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Refund processed successfully", refund));
    }
}
