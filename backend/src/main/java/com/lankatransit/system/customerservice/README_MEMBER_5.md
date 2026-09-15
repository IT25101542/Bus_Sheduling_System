# Member 5: Customer Service Management
- **Student Name:** Nimjaya G.S.
- **Student ID:** IT25102352
- **Module Code:** UC-05 / FR-05
- **Full Requirement Specification:** [`backend/requirements/FR5_Customer_Service_Nimjaya_IT25102352.md`](../../../requirements/FR5_Customer_Service_Nimjaya_IT25102352.md)

### Key Classes:
- Entities: `Complaint.java`, `SupportRequest.java`, `Feedback.java`, `Notification.java`
- Service: `CustomerServiceService.java` (Implements complaint lifecycle state machine OPEN->IN_PROGRESS->RESOLVED->CLOSED, helpdesk responses, 5-star ratings, notification broadcasts)
- Controllers: `ComplaintController.java`, `SupportRequestController.java`, `FeedbackController.java`, `NotificationController.java`
