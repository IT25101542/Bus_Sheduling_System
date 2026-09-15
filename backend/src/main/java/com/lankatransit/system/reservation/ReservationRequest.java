package com.lankatransit.system.reservation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReservationRequest {

    @NotNull(message = "Trip ID is required")
    private Long tripId;

    private Long customerId;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotBlank(message = "Passenger phone number is required")
    private String passengerPhone;

    private String passengerNic;

    @NotBlank(message = "Seat number is required")
    private String seatNumber;

    private String passengerType = "ADULT"; // ADULT, CHILD, STUDENT, SENIOR
    private String paymentMethod = "CREDIT_CARD"; // CREDIT_CARD, DEBIT_CARD, CASH, ONLINE_TRANSFER

    public ReservationRequest() {}

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }

    public String getPassengerNic() { return passengerNic; }
    public void setPassengerNic(String passengerNic) { this.passengerNic = passengerNic; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getPassengerType() { return passengerType; }
    public void setPassengerType(String passengerType) { this.passengerType = passengerType; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
