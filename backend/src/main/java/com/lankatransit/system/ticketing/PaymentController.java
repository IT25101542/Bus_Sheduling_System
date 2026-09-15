package com.lankatransit.system.ticketing;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final TicketingService ticketingService;

    public PaymentController(TicketingService ticketingService) {
        this.ticketingService = ticketingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDto>>> getAllPayments() {
        return ResponseEntity.ok(ApiResponse.ok("Payments retrieved", ticketingService.getAllPayments()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentDto>> processPayment(@Valid @RequestBody PaymentDto dto) {
        PaymentDto result = ticketingService.processPayment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Payment processed successfully", result));
    }

    @GetMapping("/reports/financial")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFinancialReport() {
        return ResponseEntity.ok(ApiResponse.ok("Financial report retrieved", ticketingService.getFinancialReport()));
    }
}
