package com.lankatransit.system.ticketing;

import com.lankatransit.system.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketingService ticketingService;

    public TicketController(TicketingService ticketingService) {
        this.ticketingService = ticketingService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketDto>>> getAllTickets(
            @RequestParam(required = false) Long customerId) {
        List<TicketDto> list = (customerId != null)
                ? ticketingService.getTicketsByCustomer(customerId)
                : ticketingService.getAllTickets();
        return ResponseEntity.ok(ApiResponse.ok("Tickets retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketDto>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket retrieved", ticketingService.getTicketById(id)));
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ApiResponse<TicketDto>> getTicketByReservation(@PathVariable Long reservationId) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket retrieved", ticketingService.getTicketByReservation(reservationId)));
    }

    @PostMapping("/generate/{reservationId}")
    public ResponseEntity<ApiResponse<TicketDto>> issueTicket(@PathVariable Long reservationId) {
        TicketDto ticket = ticketingService.issueTicket(reservationId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Electronic ticket generated", ticket));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelTicket(@PathVariable Long id) {
        ticketingService.cancelTicket(id);
        return ResponseEntity.ok(ApiResponse.ok("Ticket cancelled", null));
    }
}
