package com.lankatransit.system.loyalty;

import com.lankatransit.system.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class LoyaltyController {

    private final LoyaltyService loyaltyService;

    public LoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    // Program CRUD
    @GetMapping("/programs")
    public ResponseEntity<ApiResponse<List<RewardProgramDto>>> getAllPrograms() {
        return ResponseEntity.ok(ApiResponse.ok("Programs retrieved", loyaltyService.getAllPrograms()));
    }

    @GetMapping("/programs/{id}")
    public ResponseEntity<ApiResponse<RewardProgramDto>> getProgramById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Program retrieved", loyaltyService.getProgramById(id)));
    }

    @PostMapping("/programs")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<RewardProgramDto>> createProgram(@Valid @RequestBody RewardProgramDto dto) {
        RewardProgramDto created = loyaltyService.createProgram(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Reward program created successfully", created));
    }

    @PutMapping("/programs/{id}")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<RewardProgramDto>> updateProgram(@PathVariable Long id, @Valid @RequestBody RewardProgramDto dto) {
        RewardProgramDto updated = loyaltyService.updateProgram(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Reward program updated successfully", updated));
    }

    @DeleteMapping("/programs/{id}")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProgram(@PathVariable Long id) {
        loyaltyService.deleteProgram(id);
        return ResponseEntity.ok(ApiResponse.ok("Reward program deleted successfully", null));
    }

    // Account & Points
    @GetMapping("/account/{customerId}")
    public ResponseEntity<ApiResponse<RewardAccountDto>> getCustomerAccount(@PathVariable Long customerId) {
        RewardAccountDto account = loyaltyService.getAccountByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.ok("Loyalty account retrieved", account));
    }

    @PostMapping("/redeem")
    public ResponseEntity<ApiResponse<RewardAccountDto>> redeemReward(@Valid @RequestBody RedeemRequest request) {
        RewardAccountDto account = loyaltyService.redeemReward(request);
        return ResponseEntity.ok(ApiResponse.ok("Reward redeemed successfully", account));
    }

    @PostMapping("/points/add")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<RewardAccountDto>> addPoints(
            @RequestParam Long customerId,
            @RequestParam int points,
            @RequestParam String description) {
        RewardAccountDto account = loyaltyService.addPoints(customerId, points, description);
        return ResponseEntity.ok(ApiResponse.ok("Points added successfully", account));
    }

    // Transactions
    @GetMapping("/history/{customerId}")
    public ResponseEntity<ApiResponse<List<RewardTransactionDto>>> getCustomerHistory(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.ok("History retrieved", loyaltyService.getTransactionsByCustomer(customerId)));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('FINANCE_ADMIN', 'SYSTEM_ADMIN')")
    public ResponseEntity<ApiResponse<List<RewardTransactionDto>>> getAllHistory() {
        return ResponseEntity.ok(ApiResponse.ok("All transactions retrieved", loyaltyService.getAllTransactions()));
    }
}
