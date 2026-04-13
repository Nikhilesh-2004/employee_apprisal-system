package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "appraisal_summary")
@Data
public class AppraisalSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    @ManyToOne
    @JoinColumn(name = "cycle_id")
    private AppraisalCycle cycle;

    @Column(name = "self_score")
    private Double selfScore;

    @Column(name = "manager_score")
    private Double managerScore;

    @Column(name = "committee_score")
    private Double committeeScore;

    @Column(name = "final_score")
    private Double finalScore;

    @Column(name = "promotion_recommended")
    private Boolean promotionRecommended = false;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
