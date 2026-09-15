package com.lankatransit.system.customerservice;

import com.lankatransit.system.auth.Customer;
import com.lankatransit.system.auth.CustomerRepository;
import com.lankatransit.system.exception.ResourceNotFoundException;
import com.lankatransit.system.reservation.Trip;
import com.lankatransit.system.reservation.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceService {

    private final ComplaintRepository complaintRepository;
    private final SupportRequestRepository supportRequestRepository;
    private final FeedbackRepository feedbackRepository;
    private final NotificationRepository notificationRepository;
    private final CustomerRepository customerRepository;
    private final TripRepository tripRepository;

    public CustomerServiceService(ComplaintRepository complaintRepository,
                                  SupportRequestRepository supportRequestRepository,
                                  FeedbackRepository feedbackRepository,
                                  NotificationRepository notificationRepository,
                                  CustomerRepository customerRepository,
                                  TripRepository tripRepository) {
        this.complaintRepository = complaintRepository;
        this.supportRequestRepository = supportRequestRepository;
        this.feedbackRepository = feedbackRepository;
        this.notificationRepository = notificationRepository;
        this.customerRepository = customerRepository;
        this.tripRepository = tripRepository;
    }

    // ==========================================
    // COMPLAINTS CRUD
    // ==========================================
    public List<ComplaintDto> getAllComplaints() {
        return complaintRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(this::mapToComplaintDto)
                .collect(Collectors.toList());
    }

    public List<ComplaintDto> getComplaintsByCustomer(Long customerId) {
        return complaintRepository.findByCustomerIdOrderBySubmittedAtDesc(customerId).stream()
                .map(this::mapToComplaintDto)
                .collect(Collectors.toList());
    }

    public ComplaintDto getComplaintById(Long id) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        return mapToComplaintDto(c);
    }

    @Transactional
    public ComplaintDto createComplaint(ComplaintDto dto) {
        Customer customer = null;
        if (dto.getCustomerId() != null) {
            customer = customerRepository.findById(dto.getCustomerId()).orElse(null);
        }

        String complaintCode = "CMP-2026-" + (100 + (int)(Math.random() * 899));

        Complaint complaint = new Complaint(
                complaintCode,
                customer,
                dto.getCategory(),
                dto.getSubject(),
                dto.getDescription(),
                dto.getTripReference()
        );
        Complaint saved = complaintRepository.save(complaint);
        return mapToComplaintDto(saved);
    }

    @Transactional
    public ComplaintDto updateComplaintStatus(Long id, String status, String resolutionNotes) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));

        complaint.setStatus(status);
        if (resolutionNotes != null && !resolutionNotes.trim().isEmpty()) {
            complaint.setResolutionNotes(resolutionNotes);
        }
        if ("RESOLVED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status)) {
            complaint.setResolvedAt(LocalDateTime.now());
            // Send alert notification to customer
            if (complaint.getCustomer() != null) {
                Notification notification = new Notification(
                        complaint.getCustomer().getUser().getId(),
                        "CUSTOMER",
                        "Complaint Status Updated: " + complaint.getComplaintCode(),
                        "Your complaint regarding '" + complaint.getSubject() + "' has been marked as " + status + ". Resolution: " + complaint.getResolutionNotes(),
                        "ALERT"
                );
                notificationRepository.save(notification);
            }
        }

        Complaint updated = complaintRepository.save(complaint);
        return mapToComplaintDto(updated);
    }

    @Transactional
    public void deleteComplaint(Long id) {
        Complaint c = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
        complaintRepository.delete(c);
    }

    // ==========================================
    // SUPPORT REQUESTS CRUD
    // ==========================================
    public List<SupportRequestDto> getAllSupportRequests() {
        return supportRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToSupportRequestDto)
                .collect(Collectors.toList());
    }

    public List<SupportRequestDto> getSupportRequestsByCustomer(Long customerId) {
        return supportRequestRepository.findByCustomerIdOrderByCreatedAtDesc(customerId).stream()
                .map(this::mapToSupportRequestDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupportRequestDto createSupportRequest(SupportRequestDto dto) {
        Customer customer = null;
        if (dto.getCustomerId() != null) {
            customer = customerRepository.findById(dto.getCustomerId()).orElse(null);
        }
        String requestCode = "SUP-2026-" + (100 + (int)(Math.random() * 899));

        SupportRequest req = new SupportRequest(
                requestCode,
                customer,
                dto.getSubject(),
                dto.getPriority(),
                dto.getDescription()
        );
        SupportRequest saved = supportRequestRepository.save(req);
        return mapToSupportRequestDto(saved);
    }

    @Transactional
    public SupportRequestDto respondSupportRequest(Long id, String response, String status) {
        SupportRequest req = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Support request not found: " + id));

        req.setResponse(response);
        if (status != null && !status.trim().isEmpty()) {
            req.setStatus(status);
        }
        SupportRequest saved = supportRequestRepository.save(req);
        return mapToSupportRequestDto(saved);
    }

    @Transactional
    public void deleteSupportRequest(Long id) {
        SupportRequest req = supportRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Support request not found: " + id));
        supportRequestRepository.delete(req);
    }

    // ==========================================
    // FEEDBACK CRUD
    // ==========================================
    public List<FeedbackDto> getAllFeedbacks() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToFeedbackDto)
                .collect(Collectors.toList());
    }

    public List<FeedbackDto> getFeedbacksByTrip(Long tripId) {
        return feedbackRepository.findByTripIdOrderByCreatedAtDesc(tripId).stream()
                .map(this::mapToFeedbackDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackDto createFeedback(FeedbackDto dto) {
        Customer customer = null;
        if (dto.getCustomerId() != null) {
            customer = customerRepository.findById(dto.getCustomerId()).orElse(null);
        }
        Trip trip = null;
        if (dto.getTripId() != null) {
            trip = tripRepository.findById(dto.getTripId()).orElse(null);
        }

        Feedback fb = new Feedback(customer, trip, dto.getRating(), dto.getComments());
        Feedback saved = feedbackRepository.save(fb);
        return mapToFeedbackDto(saved);
    }

    @Transactional
    public void deleteFeedback(Long id) {
        Feedback fb = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found: " + id));
        feedbackRepository.delete(fb);
    }

    // ==========================================
    // NOTIFICATIONS CRUD
    // ==========================================
    public List<NotificationDto> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToNotificationDto)
                .collect(Collectors.toList());
    }

    public List<NotificationDto> getNotificationsByRecipient(Long recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId).stream()
                .map(this::mapToNotificationDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDto createNotification(NotificationDto dto) {
        Notification notification = new Notification(
                dto.getRecipientId(),
                dto.getRecipientRole(),
                dto.getTitle(),
                dto.getMessage(),
                dto.getNotificationType()
        );
        Notification saved = notificationRepository.save(notification);
        return mapToNotificationDto(saved);
    }

    @Transactional
    public void markNotificationRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void deleteNotification(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        notificationRepository.delete(n);
    }

    // Mapping helpers
    private ComplaintDto mapToComplaintDto(Complaint c) {
        ComplaintDto dto = new ComplaintDto();
        dto.setId(c.getId());
        dto.setComplaintCode(c.getComplaintCode());
        dto.setCustomerId(c.getCustomer() != null ? c.getCustomer().getId() : null);
        dto.setCustomerName(c.getCustomer() != null ? c.getCustomer().getUser().getFullName() : "Anonymous Passenger");
        dto.setCategory(c.getCategory());
        dto.setSubject(c.getSubject());
        dto.setDescription(c.getDescription());
        dto.setTripReference(c.getTripReference());
        dto.setStatus(c.getStatus());
        dto.setResolutionNotes(c.getResolutionNotes());
        dto.setSubmittedAt(c.getSubmittedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }

    private SupportRequestDto mapToSupportRequestDto(SupportRequest s) {
        SupportRequestDto dto = new SupportRequestDto();
        dto.setId(s.getId());
        dto.setRequestCode(s.getRequestCode());
        dto.setCustomerId(s.getCustomer() != null ? s.getCustomer().getId() : null);
        dto.setCustomerName(s.getCustomer() != null ? s.getCustomer().getUser().getFullName() : "Guest Passenger");
        dto.setSubject(s.getSubject());
        dto.setPriority(s.getPriority());
        dto.setDescription(s.getDescription());
        dto.setStatus(s.getStatus());
        dto.setResponse(s.getResponse());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }

    private FeedbackDto mapToFeedbackDto(Feedback f) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(f.getId());
        dto.setCustomerId(f.getCustomer() != null ? f.getCustomer().getId() : null);
        dto.setCustomerName(f.getCustomer() != null ? f.getCustomer().getUser().getFullName() : "Verified Passenger");
        dto.setTripId(f.getTrip() != null ? f.getTrip().getId() : null);
        dto.setTripCode(f.getTrip() != null ? f.getTrip().getTripCode() : null);
        dto.setRouteName(f.getTrip() != null ? f.getTrip().getRoute().getOrigin() + " -> " + f.getTrip().getRoute().getDestination() : "General Experience");
        dto.setRating(f.getRating());
        dto.setComments(f.getComments());
        dto.setCreatedAt(f.getCreatedAt());
        return dto;
    }

    private NotificationDto mapToNotificationDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setRecipientId(n.getRecipientId());
        dto.setRecipientRole(n.getRecipientRole());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setNotificationType(n.getNotificationType());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
