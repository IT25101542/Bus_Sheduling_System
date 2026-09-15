# University Software Engineering Group Project — Individual Functional Requirement Specification

# FUNCTIONAL REQUIREMENT 05 (FR-05 / UC-05)
## Customer Service & Grievance Lifecycle Management

---

### Student Attribution & Academic Details
- **Assigned Group Member:** Nimjaya G.S.
- **Student Registration Number:** IT25102352
- **Academic Degree:** BSc (Hons) in Information Technology / Software Engineering
- **Institution:** Sri Lanka Institute of Information Technology (SLIIT)
- **Module Name:** Software Engineering Project (Year 2 / Year 3)
- **Client Organization:** Lanka Transit Services (Pvt) Ltd

---

## 1. Requirement Scope & Business Objectives

### 1.1 Objective
The Customer Service & Grievance Lifecycle Management module safeguards passenger satisfaction and operational quality for Lanka Transit Services. It provides a formal grievance tracking system enforcing the standard customer service resolution lifecycle (`OPEN` &rarr; `IN_PROGRESS` &rarr; `RESOLVED` &rarr; `CLOSED`), a structured helpdesk inquiry portal for travel assistance and lost property, passenger trip rating and reviews (1 to 5 stars) for coach cleanliness and driver conduct audits, and an automated push notification and broadcast alert dispatch engine.

### 1.2 Primary & Secondary Actors
- **Customer Service Supervisor (Primary):** Investigates passenger grievances, transitions incident states, records corrective action notes, and dispatches service bulletins.
- **Passenger / Customer (Primary):** Lodges incident complaints, submits support queries, posts journey star reviews, and reads transit alerts.
- **Depot Manager (Secondary):** Receives assigned vehicle maintenance or driver conduct complaints from the supervisor.
- **System Administrator (Secondary):** Audits helpdesk response times and satisfaction metrics.

---

## 2. Detailed Functional Requirements (FR Specifications)

| Requirement ID | Feature / Use Case | Description | Business Rules & Constraints |
|:---|:---|:---|:---|
| **FR-5.1** | **Customer Complaint Lodging** | Customers log grievances by category (`BUS_CONDITION`, `DRIVER_CONDUCT`, `SCHEDULE_DELAY`, `FARE_ISSUE`, `LOST_PROPERTY`). | Generates unique complaint reference code (e.g. `CMP-2026-XXXXX`). Initial status set to `OPEN`. |
| **FR-5.2** | **Complaint Lifecycle Management** | Supervisor transitions complaint states: `OPEN` &rarr; `IN_PROGRESS` (investigating with depot/driver) &rarr; `RESOLVED` (action taken/compensation issued) &rarr; `CLOSED`. | Resolution notes must be provided when moving to `RESOLVED` or `CLOSED`. Records `resolvedAt` timestamp. |
| **FR-5.3** | **Support Helpdesk Inquiries** | General passenger queries regarding timetables, luggage policies, or booking assistance with priority ranking (`LOW`, `MEDIUM`, `HIGH`, `URGENT`). | Generates `requestCode`. Supervisor replies with official response and closes inquiry. |
| **FR-5.4** | **Trip Feedback & 5-Star Ratings** | Post-trip customer feedback evaluating coach comfort, AC cooling, hygiene, and driver punctuality. | Rating constrained between 1 and 5 stars. Calculates network average satisfaction score. |
| **FR-5.5** | **Automated Service Notifications** | In-app notification dispatch for booking confirmations, delay advisories, and weather warnings. | Supports targeting by recipient ID or role (`CUSTOMER`, `OPERATIONS_MANAGER`, `ALL`). Read/unread tracking. |
| **FR-5.6** | **Emergency System Broadcast** | Supervisor broadcasts urgent travel advisories (e.g. Expressway closed due to heavy rain). | Dispatches high-priority alert to all connected passenger dashboards. |

---

## 3. Backend Package Architecture & Source Code Mapping

All source code files for Member 5 reside in:
📂 `backend/src/main/java/com/lankatransit/system/customerservice/`

### 3.1 Entities (`@Entity`)
1. **`Complaint.java`**
   - Table: `complaints`
   - Fields: `id` (PK), `complaintCode` (Unique), `customer_id` (FK), `customerName`, `category` (Enum), `subject`, `description`, `tripReference`, `status` (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), `resolutionNotes`, `submittedAt`, `resolvedAt`.
2. **`SupportRequest.java`**
   - Table: `support_requests`
   - Fields: `id` (PK), `requestCode` (Unique), `customer_id` (FK), `customerName`, `subject`, `priority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), `description`, `status` (`OPEN`, `IN_PROGRESS`, `CLOSED`), `response`, `createdAt`.
3. **`Feedback.java`**
   - Table: `feedbacks`
   - Fields: `id` (PK), `customer_id` (FK), `customerName`, `trip_id` (FK), `tripCode`, `routeName`, `rating` (INT 1-5), `comments`, `createdAt`.
4. **`Notification.java`**
   - Table: `notifications`
   - Fields: `id` (PK), `recipientId` (FK nullable for broadcast), `recipientRole` (`CUSTOMER`, `OPERATIONS_MANAGER`, `ALL`), `title`, `message`, `read` (BOOLEAN), `notificationType` (`INFO`, `ALERT`, `DELAY`, `PROMOTION`), `createdAt`.

### 3.2 Repositories (`@Repository`)
- `ComplaintRepository.java`: `findByCustomerId(Long customerId)`, `findByStatus(String status)`, `findByCategory(String category)`
- `SupportRequestRepository.java`: `findByCustomerId(Long customerId)`, `findByStatus(String status)`
- `FeedbackRepository.java`: `findByTripId(Long tripId)`, `calculateAverageRating()`
- `NotificationRepository.java`: `findByRecipientIdOrRole(Long id, String role)`

### 3.3 Data Transfer Objects (`DTOs`)
- `ComplaintDto.java` (Bean Validation: `@NotBlank`)
- `SupportRequestDto.java` (Bean Validation: `@NotBlank`, `@Pattern`)
- `FeedbackDto.java` (Bean Validation: `@Min(1)`, `@Max(5)`)
- `NotificationDto.java` (Bean Validation: `@NotBlank`)

### 3.4 Service Implementation (`CustomerServiceService.java`)
Key algorithmic logic implemented:
```java
// Grievance Lifecycle State Machine & Notification Trigger
@Transactional
public ComplaintDto updateComplaintStatus(Long id, String newStatus, String resolutionNotes) {
    Complaint complaint = complaintRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Complaint ticket not found"));

    complaint.setStatus(newStatus);
    complaint.setResolutionNotes(resolutionNotes);

    if ("RESOLVED".equalsIgnoreCase(newStatus) || "CLOSED".equalsIgnoreCase(newStatus)) {
        complaint.setResolvedAt(LocalDateTime.now());
    }

    complaintRepository.save(complaint);

    // Automatically trigger notification alert to the customer
    if (complaint.getCustomer() != null) {
        Notification alert = new Notification();
        alert.setRecipientId(complaint.getCustomer().getId());
        alert.setTitle("Complaint " + complaint.getComplaintCode() + " Update");
        alert.setMessage("Status changed to " + newStatus + ". Resolution: " + resolutionNotes);
        alert.setNotificationType("INFO");
        notificationRepository.save(alert);
    }

    return mapToDto(complaint);
}
```

### 3.5 REST Controllers
- `ComplaintController.java` (`/api/complaints`)
- `SupportRequestController.java` (`/api/support-requests`)
- `FeedbackController.java` (`/api/feedbacks`)
- `NotificationController.java` (`/api/notifications`)

---

## 4. REST API Endpoint Reference

| HTTP Method | URL Path | Role Required | Description |
|:---:|:---|:---|:---|
| `GET` | `/api/complaints` | Any Authenticated | List all complaints (filtered by customer if passenger) |
| `GET` | `/api/complaints/{id}` | Any Authenticated | View details of a specific complaint |
| `POST` | `/api/complaints` | Any Authenticated | Lodge a new customer service complaint |
| `PUT` | `/api/complaints/{id}/status` | `CUSTOMER_SERVICE_SUPERVISOR`, `SYSTEM_ADMIN` | Advance lifecycle state & add resolution notes |
| `GET` | `/api/support-requests` | Any Authenticated | View support inquiry helpdesk tickets |
| `POST` | `/api/support-requests` | Any Authenticated | Create a new helpdesk inquiry |
| `PUT` | `/api/support-requests/{id}/respond` | `CUSTOMER_SERVICE_SUPERVISOR`, `SYSTEM_ADMIN` | Post official response to helpdesk query |
| `GET` | `/api/feedbacks` | Any Authenticated | View trip ratings and reviews |
| `POST` | `/api/feedbacks` | Any Authenticated | Submit journey rating (1-5 stars) |
| `GET` | `/api/notifications` | Any Authenticated | Retrieve customer's bulletins and alerts |
| `POST` | `/api/notifications` | `CUSTOMER_SERVICE_SUPERVISOR`, `SYSTEM_ADMIN` | Broadcast announcement to passengers/staff |
| `PUT` | `/api/notifications/{id}/read` | Any Authenticated | Mark notification as read |

---

## 5. Sample JSON Payloads

### POST `/api/complaints` (Lodge Grievance)
```json
{
  "category": "BUS_CONDITION",
  "subject": "AC malfunction on Southern Expressway Coach",
  "description": "The air conditioning unit in bus ND-8899 was completely off during the 11:00 AM Galle to Colombo trip. Passengers suffered severe heat.",
  "tripReference": "TRP-101"
}
```

### PUT `/api/complaints/1/status?status=RESOLVED&resolutionNotes=Bus AC filter inspected and repaired at Colombo depot. 100 bonus loyalty points credited to customer.`

---

## 6. University Viva Examination Defense Guide

**Q1: Explain how the complaint resolution lifecycle is modeled and controlled in your backend.**  
*Answer:* The complaint lifecycle is modeled using the state progression: `OPEN` &rarr; `IN_PROGRESS` &rarr; `RESOLVED` &rarr; `CLOSED`. Passengers are authorized to create complaints (starting at `OPEN`), while role-based security (`@PreAuthorize("hasRole('CUSTOMER_SERVICE_SUPERVISOR')")`) ensures only authorized supervisory staff can transition states. When transitioning to `RESOLVED`, the system requires mandatory `resolutionNotes`, sets `resolvedAt`, and triggers an automated notification to the customer.

**Q2: How do you prevent invalid rating inputs (e.g. 0 stars or 10 stars)?**  
*Answer:* In `FeedbackDto.java`, the `rating` field is decorated with `@Min(value = 1)` and `@Max(value = 5)` Jakarta Bean Validation annotations. If a client attempts to send an out-of-bounds integer, Spring Boot's validation layer halts execution before reaching the service layer and returns a `400 Bad Request`.

**Q3: How does the notification broadcasting mechanism work?**  
*Answer:* The `Notification` entity contains a `recipientRole` column in addition to a nullable `recipientId`. When an emergency alert is broadcast, `recipientRole` is set to `CUSTOMER` or `ALL`. The repository query `findByRecipientIdOrRole()` uses boolean logic (`recipientId = :id OR recipientRole IN (:roles, 'ALL')`) to deliver the message to the intended audience.
