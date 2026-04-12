package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "appraisal_summary")
public class AppraisalSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private Long appraisalCycleId;
    
    private Double selfAverageScore;
    private Double managerAverageScore;
    private Double committeeFinalScore;
    
    // e.g. YES, NO
    private String promotionRecommendation;
    // e.g. PROMOTED, REJECTED, PENDING
    private String status;
}
