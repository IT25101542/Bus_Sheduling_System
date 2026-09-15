package com.lankatransit.system.tripplanning;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final TripPlanningService service;

    public BusController(TripPlanningService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Bus>>> getAllBuses() {
        return ResponseEntity.ok(ApiResponse.ok("Buses retrieved", service.getAllBuses()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Bus>> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Bus retrieved", service.getBusById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'BUS_DEPOT_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Bus>> createBus(@Valid @RequestBody BusDto dto) {
        Bus bus = service.createBus(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Bus created successfully", bus));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'BUS_DEPOT_SUPERVISOR', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Bus>> updateBus(@PathVariable Long id, @Valid @RequestBody BusDto dto) {
        Bus bus = service.updateBus(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Bus updated successfully", bus));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        service.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.ok("Bus deleted successfully", null));
    }
}
