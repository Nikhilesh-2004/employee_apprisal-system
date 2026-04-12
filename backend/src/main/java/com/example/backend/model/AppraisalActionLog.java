package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appraisal_action_log")
public class AppraisalActionLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appraisalCycleId;
    private Long employeeId;
    
    private String action; // e.g. SUBMITTED_MANAGER_REVIEW
    private Long performedBy;
    
    private String oldStatus;
    private String newStatus;
    
    private LocalDateTime timestamp;
}
