package com.lankatransit.system.customerservice;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final CustomerServiceService service;

    public ComplaintController(CustomerServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ComplaintDto>>> getAllComplaints(
            @RequestParam(required = false) Long customerId) {
        List<ComplaintDto> list = (customerId != null)
                ? service.getComplaintsByCustomer(customerId)
                : service.getAllComplaints();
        return ResponseEntity.ok(ApiResponse.ok("Complaints retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ComplaintDto>> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Complaint retrieved", service.getComplaintById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintDto>> createComplaint(@Valid @RequestBody ComplaintDto dto) {
        ComplaintDto created = service.createComplaint(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Complaint submitted successfully", created));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('CUSTOMER_SERVICE_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<ComplaintDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNotes) {
        ComplaintDto updated = service.updateComplaintStatus(id, status, resolutionNotes);
        return ResponseEntity.ok(ApiResponse.ok("Complaint status updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER_SERVICE_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteComplaint(@PathVariable Long id) {
        service.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.ok("Complaint record removed", null));
    }
}
