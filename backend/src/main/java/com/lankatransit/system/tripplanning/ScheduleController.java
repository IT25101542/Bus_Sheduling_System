package com.lankatransit.system.tripplanning;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final TripPlanningService service;

    public ScheduleController(TripPlanningService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleDto>>> getAllSchedules() {
        return ResponseEntity.ok(ApiResponse.ok("Schedules retrieved", service.getAllSchedules()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleDto>> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Schedule retrieved", service.getScheduleById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleDto>> createSchedule(@Valid @RequestBody ScheduleDto dto) {
        ScheduleDto created = service.createSchedule(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Schedule created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleDto>> updateSchedule(@PathVariable Long id, @Valid @RequestBody ScheduleDto dto) {
        ScheduleDto updated = service.updateSchedule(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Schedule updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        service.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.ok("Schedule deleted successfully", null));
    }
}
