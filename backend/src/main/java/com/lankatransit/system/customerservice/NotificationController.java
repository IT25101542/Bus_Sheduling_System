package com.lankatransit.system.customerservice;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final CustomerServiceService service;

    public NotificationController(CustomerServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getAllNotifications(
            @RequestParam(required = false) Long recipientId) {
        List<NotificationDto> list = (recipientId != null)
                ? service.getNotificationsByRecipient(recipientId)
                : service.getAllNotifications();
        return ResponseEntity.ok(ApiResponse.ok("Notifications retrieved", list));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER_SERVICE_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<NotificationDto>> sendNotification(@Valid @RequestBody NotificationDto dto) {
        NotificationDto created = service.createNotification(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Notification dispatched", created));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        service.markNotificationRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.ok("Notification deleted", null));
    }
}
