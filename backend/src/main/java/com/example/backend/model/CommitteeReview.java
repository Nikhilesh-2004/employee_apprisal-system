package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "committee_reviews")
@Data
public class CommitteeReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    @ManyToOne
    @JoinColumn(name = "cycle_id")
    private AppraisalCycle cycle;

    @Column(name = "final_rating")
    private Double finalRating;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "override_reason", columnDefinition = "TEXT")
    private String overrideReason;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt = LocalDateTime.now();
}
