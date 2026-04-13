package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "appraisal_cycles")
@Data
public class AppraisalCycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cycle_name", nullable = false)
    private String cycleName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "self_assessment_deadline")
    private LocalDate selfAssessmentDeadline;

    @Column(name = "manager_review_deadline")
    private LocalDate managerReviewDeadline;

    @Column(name = "committee_review_deadline")
    private LocalDate committeeReviewDeadline;

    @Enumerated(EnumType.STRING)
    private Status status = Status.DRAFT;

    public enum Status {
        DRAFT, ACTIVE, SELF_ASSESSMENT, MANAGER_REVIEW, COMMITTEE_REVIEW, COMPLETED, CANCELLED
    }
}
