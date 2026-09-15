package com.lankatransit.system.tripplanning;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delays")
public class DelayController {

    private final TripPlanningService service;

    public DelayController(TripPlanningService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DelayDto>>> getAllDelays() {
        return ResponseEntity.ok(ApiResponse.ok("Delays retrieved", service.getAllDelays()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'BUS_DEPOT_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<DelayDto>> logDelay(@Valid @RequestBody DelayDto dto) {
        DelayDto logged = service.logDelay(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Delay logged successfully", logged));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDelay(@PathVariable Long id) {
        service.deleteDelay(id);
        return ResponseEntity.ok(ApiResponse.ok("Delay record deleted successfully", null));
    }
}
