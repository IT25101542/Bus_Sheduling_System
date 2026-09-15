package com.lankatransit.system.customerservice;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-requests")
public class SupportRequestController {

    private final CustomerServiceService service;

    public SupportRequestController(CustomerServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupportRequestDto>>> getAllRequests(
            @RequestParam(required = false) Long customerId) {
        List<SupportRequestDto> list = (customerId != null)
                ? service.getSupportRequestsByCustomer(customerId)
                : service.getAllSupportRequests();
        return ResponseEntity.ok(ApiResponse.ok("Support requests retrieved", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupportRequestDto>> createRequest(@Valid @RequestBody SupportRequestDto dto) {
        SupportRequestDto created = service.createSupportRequest(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Support request created", created));
    }

    @PutMapping("/{id}/respond")
    @PreAuthorize("hasAnyRole('CUSTOMER_SERVICE_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<SupportRequestDto>> respond(
            @PathVariable Long id,
            @RequestParam String response,
            @RequestParam(defaultValue = "CLOSED") String status) {
        SupportRequestDto updated = service.respondSupportRequest(id, response, status);
        return ResponseEntity.ok(ApiResponse.ok("Response recorded", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER_SERVICE_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(@PathVariable Long id) {
        service.deleteSupportRequest(id);
        return ResponseEntity.ok(ApiResponse.ok("Support request deleted", null));
    }
}
