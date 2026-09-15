package com.lankatransit.system.customerservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<Notification> findByRecipientRoleOrderByCreatedAtDesc(String recipientRole);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
