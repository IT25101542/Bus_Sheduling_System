package com.lankatransit.system.loyalty;

import com.lankatransit.system.auth.Customer;
import com.lankatransit.system.auth.CustomerRepository;
import com.lankatransit.system.exception.BadRequestException;
import com.lankatransit.system.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoyaltyService {

    private final RewardProgramRepository programRepository;
    private final RewardAccountRepository accountRepository;
    private final RewardTransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;

    public LoyaltyService(RewardProgramRepository programRepository,
                          RewardAccountRepository accountRepository,
                          RewardTransactionRepository transactionRepository,
                          CustomerRepository customerRepository) {
        this.programRepository = programRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
    }

    // ==========================================
    // REWARD PROGRAMS CRUD
    // ==========================================
    public List<RewardProgramDto> getAllPrograms() {
        return programRepository.findAll().stream().map(this::mapToProgramDto).collect(Collectors.toList());
    }

    public RewardProgramDto getProgramById(Long id) {
        RewardProgram program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward program not found: " + id));
        return mapToProgramDto(program);
    }

    @Transactional
    public RewardProgramDto createProgram(RewardProgramDto dto) {
        RewardProgram program = new RewardProgram(
                dto.getProgramName(),
                dto.getMinPoints(),
                dto.getPointMultiplier(),
                dto.getDiscountPercentage(),
                dto.getDescription(),
                dto.isActive()
        );
        RewardProgram saved = programRepository.save(program);
        return mapToProgramDto(saved);
    }

    @Transactional
    public RewardProgramDto updateProgram(Long id, RewardProgramDto dto) {
        RewardProgram program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward program not found: " + id));

        program.setProgramName(dto.getProgramName());
        program.setMinPoints(dto.getMinPoints());
        program.setPointMultiplier(dto.getPointMultiplier());
        program.setDiscountPercentage(dto.getDiscountPercentage());
        program.setDescription(dto.getDescription());
        program.setActive(dto.isActive());

        RewardProgram updated = programRepository.save(program);
        return mapToProgramDto(updated);
    }

    @Transactional
    public void deleteProgram(Long id) {
        RewardProgram program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reward program not found: " + id));
        programRepository.delete(program);
    }

    // ==========================================
    // REWARD ACCOUNT & REDEMPTION
    // ==========================================
    @Transactional
    public RewardAccountDto getAccountByCustomerId(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

        RewardAccount account = accountRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    RewardAccount newAcc = new RewardAccount(customer, 0, 0, 0, "BRONZE");
                    return accountRepository.save(newAcc);
                });

        return mapToAccountDto(account);
    }

    @Transactional
    public RewardAccountDto addPoints(Long customerId, int points, String description) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerId));

        RewardAccount account = accountRepository.findByCustomerId(customerId)
                .orElseGet(() -> new RewardAccount(customer, 0, 0, 0, "BRONZE"));

        account.setCurrentPoints(account.getCurrentPoints() + points);
        account.setTotalEarned(account.getTotalEarned() + points);
        account.updateTier();
        RewardAccount saved = accountRepository.save(account);

        RewardTransaction txn = new RewardTransaction(saved, "EARNED", points, description);
        transactionRepository.save(txn);

        return mapToAccountDto(saved);
    }

    @Transactional
    public synchronized RewardAccountDto redeemReward(RedeemRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + request.getCustomerId()));

        RewardAccount account = accountRepository.findByCustomerId(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("No reward account found for customer."));

        // Critical business rule: Prevent redemption when insufficient points
        if (account.getCurrentPoints() < request.getPoints()) {
            throw new BadRequestException("Insufficient points! You need " + request.getPoints()
                    + " points to redeem this reward, but your current balance is only " + account.getCurrentPoints() + " points.");
        }

        account.setCurrentPoints(account.getCurrentPoints() - request.getPoints());
        account.setTotalRedeemed(account.getTotalRedeemed() + request.getPoints());
        RewardAccount saved = accountRepository.save(account);

        RewardTransaction txn = new RewardTransaction(
                saved,
                "REDEEMED",
                -request.getPoints(),
                "Redeemed: " + request.getRewardName()
        );
        transactionRepository.save(txn);

        return mapToAccountDto(saved);
    }

    // ==========================================
    // REWARD TRANSACTIONS
    // ==========================================
    public List<RewardTransactionDto> getTransactionsByCustomer(Long customerId) {
        RewardAccount account = accountRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("No reward account found for customer: " + customerId));

        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(account.getId()).stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    public List<RewardTransactionDto> getAllTransactions() {
        return transactionRepository.findAllByOrderByTransactionDateDesc().stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());
    }

    // Mapping helpers
    private RewardProgramDto mapToProgramDto(RewardProgram p) {
        RewardProgramDto dto = new RewardProgramDto();
        dto.setId(p.getId());
        dto.setProgramName(p.getProgramName());
        dto.setMinPoints(p.getMinPoints());
        dto.setPointMultiplier(p.getPointMultiplier());
        dto.setDiscountPercentage(p.getDiscountPercentage());
        dto.setDescription(p.getDescription());
        dto.setActive(p.isActive());
        return dto;
    }

    private RewardAccountDto mapToAccountDto(RewardAccount a) {
        RewardAccountDto dto = new RewardAccountDto();
        dto.setId(a.getId());
        dto.setCustomerId(a.getCustomer().getId());
        dto.setCustomerName(a.getCustomer().getUser().getFullName());
        dto.setCurrentPoints(a.getCurrentPoints());
        dto.setTotalEarned(a.getTotalEarned());
        dto.setTotalRedeemed(a.getTotalRedeemed());
        dto.setTierLevel(a.getTierLevel());
        dto.setUpdatedAt(a.getUpdatedAt());
        return dto;
    }

    private RewardTransactionDto mapToTransactionDto(RewardTransaction t) {
        RewardTransactionDto dto = new RewardTransactionDto();
        dto.setId(t.getId());
        dto.setAccountId(t.getAccount().getId());
        dto.setCustomerId(t.getAccount().getCustomer().getId());
        dto.setCustomerName(t.getAccount().getCustomer().getUser().getFullName());
        dto.setTransactionType(t.getTransactionType());
        dto.setPoints(t.getPoints());
        dto.setDescription(t.getDescription());
        dto.setTransactionDate(t.getTransactionDate());
        return dto;
    }
}
