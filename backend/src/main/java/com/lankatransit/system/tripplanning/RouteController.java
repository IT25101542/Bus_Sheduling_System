package com.lankatransit.system.tripplanning;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final TripPlanningService service;

    public RouteController(TripPlanningService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.ok("Routes retrieved", service.getAllRoutes()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Route>> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Route retrieved", service.getRouteById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Route>> createRoute(@Valid @RequestBody RouteDto dto) {
        Route route = service.createRoute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Route created successfully", route));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'OPERATIONS_MANAGER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Route>> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteDto dto) {
        Route route = service.updateRoute(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Route updated successfully", route));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TRANSPORT_PLANNING_OFFICER', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        service.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.ok("Route deleted successfully", null));
    }
}
