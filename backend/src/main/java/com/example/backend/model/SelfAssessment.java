package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "self_assessment")
public class SelfAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private Long appraisalCycleId;
    private Long kpiId;
    
    private Integer selfRating; // e.g. 1-5
    private String selfComments;
    
    private String status; // SUBMITTED, PENDING
}
