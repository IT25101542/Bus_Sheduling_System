# University Software Engineering Group Project — Individual Functional Requirement Specification

# FUNCTIONAL REQUIREMENT 04 (FR-04 / UC-04)
## Loyalty Rewards & Customer Benefits Management

---

### Student Attribution & Academic Details
- **Assigned Group Member:** Berugoda B.A.N.R
- **Student Registration Number:** IT25103022
- **Academic Degree:** BSc (Hons) in Information Technology / Software Engineering
- **Institution:** Sri Lanka Institute of Information Technology (SLIIT)
- **Module Name:** Software Engineering Project (Year 2 / Year 3)
- **Client Organization:** Lanka Transit Services (Pvt) Ltd

---

## 1. Requirement Scope & Business Objectives

### 1.1 Objective
The Loyalty Rewards Management module incentivizes frequent travel across the Lanka Transit intercity network. It manages tiered membership levels (Bronze, Silver, Gold, Platinum), awards points automatically based on completed bus journeys and tier point-multipliers, enforces balance verification rules when redeeming perks from the voucher store (free coach tickets, AC class upgrades, highway rest-stop snack coupons), and maintains an immutable audit ledger of all points earned and redeemed.

### 1.2 Primary & Secondary Actors
- **Registered Customer / Passenger (Primary):** Views active points balance, tracks tier progression towards Gold/Platinum, and redeems vouchers.
- **Finance Administrator (Primary):** Configures reward program tiers, points multipliers, and fare concession quotas.
- **Marketing Officer (Secondary):** Credits promotional bonus points for marketing campaigns or route inaugural launches.
- **Ticket Booking Agent (Secondary):** Validates and applies passenger loyalty discount vouchers during booking.

---

## 2. Detailed Functional Requirements (FR Specifications)

| Requirement ID | Feature / Use Case | Description | Business Rules & Constraints |
|:---|:---|:---|:---|
| **FR-4.1** | **Loyalty Program Tiers** | Configure membership levels: `BRONZE` (Base), `SILVER` (100+ pts, 1.1x multiplier), `GOLD` (250+ pts, 1.25x multiplier), `PLATINUM` (500+ pts, 1.5x multiplier). | Minimum points threshold, point multiplier, and default ticket discount percentage. |
| **FR-4.2** | **Points Accrual Engine** | Automatically credit points to customer loyalty accounts upon ticket completion (1 point per LKR 100 spent * tier multiplier). | Points cannot be negative. Updates `totalEarned` and automatically triggers tier promotion check. |
| **FR-4.3** | **Promotional Points Credit** | Allow finance/marketing admins to grant manual goodwill or promotional bonus points. | Requires customer ID, point quantity, and mandatory campaign description. |
| **FR-4.4** | **Voucher Store & Redemption** | Allow customers to exchange earned points for perks (e.g. Free Bus Trip = 500 pts, AC Upgrade = 150 pts, LKR 500 Fare Voucher = 250 pts). | **Strict Validation Rule:** If `customer.currentPoints < requiredPoints`, redemption is blocked and throws `BadRequestException`. |
| **FR-4.5** | **Voucher Code Generation** | Upon valid redemption, generate unique alphanumeric redemption voucher token (e.g. `LT-RWD-XXXXXX`). | Decrements `currentPoints` and increments `totalRedeemed`. |
| **FR-4.6** | **Points Transaction Ledger** | Immutable historical record of all loyalty events (`EARNED` vs `REDEEMED`) with timestamps and descriptions. | Audit log entries can never be modified or deleted. |

---

## 3. Backend Package Architecture & Source Code Mapping

All source code files for Member 4 reside in:
📂 `backend/src/main/java/com/lankatransit/system/loyalty/`

### 3.1 Entities (`@Entity`)
1. **`RewardProgram.java`**
   - Table: `reward_programs`
   - Fields: `id` (PK), `programName` (e.g. "Silver Tier"), `minPoints`, `pointMultiplier`, `discountPercentage`, `description`, `active`.
2. **`RewardAccount.java`**
   - Table: `reward_accounts`
   - Fields: `id` (PK), `customer_id` (FK, Unique), `currentPoints`, `totalEarned`, `totalRedeemed`, `tierLevel` (`BRONZE`, `SILVER`, `GOLD`, `PLATINUM`), `updatedAt`.
   - Relationships: `@OneToOne` with `Customer`.
3. **`RewardTransaction.java`**
   - Table: `reward_transactions`
   - Fields: `id` (PK), `account_id` (FK), `transactionType` (`EARNED`, `REDEEMED`), `points`, `description`, `transactionDate`.

### 3.2 Repositories (`@Repository`)
- `RewardProgramRepository.java`: `findByActiveTrue()`, `findByProgramName(String name)`
- `RewardAccountRepository.java`: `findByCustomerId(Long customerId)`
- `RewardTransactionRepository.java`: `findByAccountIdOrderByTransactionDateDesc(Long accountId)`

### 3.3 Data Transfer Objects (`DTOs`)
- `RewardProgramDto.java` (Bean Validation: `@NotBlank`, `@Min(0)`)
- `RewardAccountDto.java`
- `RewardTransactionDto.java`
- `RedeemRequest.java` (Bean Validation: `@NotNull`, `@Min(1)`, `@NotBlank`)

### 3.4 Service Implementation (`LoyaltyService.java`)
Key algorithmic logic implemented:
```java
// Balance Check and Voucher Redemption
@Transactional
public RewardAccountDto redeemReward(RedeemRequest request) {
    RewardAccount account = rewardAccountRepository.findByCustomerId(request.getCustomerId())
            .orElseThrow(() -> new ResourceNotFoundException("Loyalty account not found"));

    // Crucial Business Rule: Balance Validation
    if (account.getCurrentPoints() < request.getPoints()) {
        throw new BadRequestException("Insufficient loyalty points! You have " 
            + account.getCurrentPoints() + " points, but " + request.getPoints() + " are required.");
    }

    // Deduct points
    account.setCurrentPoints(account.getCurrentPoints() - request.getPoints());
    account.setTotalRedeemed(account.getTotalRedeemed() + request.getPoints());
    rewardAccountRepository.save(account);

    // Record immutable transaction entry
    RewardTransaction txn = new RewardTransaction();
    txn.setAccount(account);
    txn.setTransactionType("REDEEMED");
    txn.setPoints(request.getPoints());
    txn.setDescription("Redeemed for: " + request.getRewardName());
    rewardTransactionRepository.save(txn);

    return mapToDto(account);
}

// Automatic Tier Promotion Rule
private void checkAndUpgradeTier(RewardAccount account) {
    int lifetime = account.getTotalEarned();
    if (lifetime >= 500) account.setTierLevel("PLATINUM");
    else if (lifetime >= 250) account.setTierLevel("GOLD");
    else if (lifetime >= 100) account.setTierLevel("SILVER");
    else account.setTierLevel("BRONZE");
}
```

### 3.5 REST Controllers
- `LoyaltyController.java` (`/api/rewards`)

---

## 4. REST API Endpoint Reference

| HTTP Method | URL Path | Role Required | Description |
|:---:|:---|:---|:---|
| `GET` | `/api/rewards/programs` | Any Authenticated | View all configured loyalty tiers and perks |
| `POST` | `/api/rewards/programs` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Create a new loyalty benefit scheme |
| `PUT` | `/api/rewards/programs/{id}` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Modify points thresholds or multipliers |
| `GET` | `/api/rewards/account/{customerId}` | Any Authenticated | Get customer points balance and current tier |
| `POST` | `/api/rewards/redeem` | `CUSTOMER`, `SYSTEM_ADMIN` | Redeem voucher with points validation check |
| `POST` | `/api/rewards/points/add` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Credit promotional bonus points |
| `GET` | `/api/rewards/history/{customerId}`| Any Authenticated | Retrieve customer's points ledger |
| `GET` | `/api/rewards/history` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Audit log of all network-wide point events |

---

## 5. Sample JSON Payloads

### POST `/api/rewards/redeem` (Redeem Voucher)
```json
{
  "customerId": 1,
  "points": 150,
  "rewardName": "Luxury AC Class Seat Upgrade"
}
```

### POST `/api/rewards/programs` (Create Tier)
```json
{
  "programName": "Gold Frequent Traveler",
  "minPoints": 250,
  "pointMultiplier": 1.25,
  "discountPercentage": 10.0,
  "description": "10% automatic fare discount on all expressway trips + priority boarding",
  "active": true
}
```

---

## 6. University Viva Examination Defense Guide

**Q1: How does your module ensure a customer cannot spend more loyalty points than they currently possess?**  
*Answer:* In `LoyaltyService.redeemReward()`, the customer's current points balance is compared against `request.getPoints()`. If `currentPoints < request.getPoints()`, execution halts immediately and throws a `BadRequestException` (`400 Bad Request`) stating the exact shortfall. Furthermore, the entire operation is marked `@Transactional` to ensure that points deduction and transaction ledger insertion succeed or roll back atomically.

**Q2: How does the system handle tier upgrades (e.g. Bronze to Gold)?**  
*Answer:* Tier progression is evaluated based on `totalEarned` (lifetime points accumulated) rather than just currently spendable points. Whenever points are earned, `checkAndUpgradeTier()` evaluates whether the customer has crossed the threshold for Silver (100+), Gold (250+), or Platinum (500+). Once unlocked, higher tiers grant higher point-earning multipliers and automatic fare discounts.

**Q3: Why did you separate `RewardAccount` from `RewardTransaction`?**  
*Answer:* This follows normalized relational database design (3NF) and the **Ledger Architecture Pattern**. `RewardAccount` maintains the aggregated state (`currentPoints`, `tierLevel`), while `RewardTransaction` stores an append-only event stream of individual accruals and redemptions. This prevents race conditions and provides an untampered audit trail for financial accounting.
