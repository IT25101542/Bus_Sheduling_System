package com.lankatransit.system.tripplanning;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final TripPlanningService service;

    public DriverController(TripPlanningService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Driver>>> getAllDrivers() {
        return ResponseEntity.ok(ApiResponse.ok("Drivers retrieved", service.getAllDrivers()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Driver>> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Driver retrieved", service.getDriverById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'BUS_DEPOT_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Driver>> createDriver(@Valid @RequestBody DriverDto dto) {
        Driver driver = service.createDriver(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Driver registered successfully", driver));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'BUS_DEPOT_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Driver>> updateDriver(@PathVariable Long id, @Valid @RequestBody DriverDto dto) {
        Driver driver = service.updateDriver(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Driver updated successfully", driver));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDriver(@PathVariable Long id) {
        service.deleteDriver(id);
        return ResponseEntity.ok(ApiResponse.ok("Driver removed successfully", null));
    }
}
