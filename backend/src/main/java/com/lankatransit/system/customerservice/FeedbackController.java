package com.lankatransit.system.customerservice;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final CustomerServiceService service;

    public FeedbackController(CustomerServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getAllFeedbacks(
            @RequestParam(required = false) Long tripId) {
        List<FeedbackDto> list = (tripId != null)
                ? service.getFeedbacksByTrip(tripId)
                : service.getAllFeedbacks();
        return ResponseEntity.ok(ApiResponse.ok("Feedbacks retrieved", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDto>> createFeedback(@Valid @RequestBody FeedbackDto dto) {
        FeedbackDto created = service.createFeedback(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Feedback submitted, thank you!", created));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER_SERVICE_SUPERVISOR', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Long id) {
        service.deleteFeedback(id);
        return ResponseEntity.ok(ApiResponse.ok("Feedback deleted", null));
    }
}
