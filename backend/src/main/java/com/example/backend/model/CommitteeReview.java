package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "committee_review")
public class CommitteeReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private Long appraisalCycleId;
    
    private Double finalRating;
    private String committeeRemarks;
    
    private Long reviewedBy; // user ID of committee member
}
