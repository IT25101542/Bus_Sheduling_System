package com.lankatransit.system.reservation;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waiting-list")
public class WaitingListController {

    private final ReservationService reservationService;

    public WaitingListController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WaitingListDto>>> getWaitingList() {
        return ResponseEntity.ok(ApiResponse.ok("Waiting list retrieved", reservationService.getAllWaitingList()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WaitingListDto>> addToWaitingList(@Valid @RequestBody WaitingListDto dto) {
        WaitingListDto created = reservationService.addToWaitingList(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Added to waiting list", created));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeFromWaitingList(@PathVariable Long id) {
        reservationService.removeFromWaitingList(id);
        return ResponseEntity.ok(ApiResponse.ok("Removed from waiting list", null));
    }
}
