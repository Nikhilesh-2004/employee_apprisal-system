package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "appraisal_cycle")
public class AppraisalCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cycleName;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate selfAssessmentDeadline;
    private LocalDate managerReviewDeadline;
    
    // e.g. ACTIVE, CLOSED
    private String status;
}
