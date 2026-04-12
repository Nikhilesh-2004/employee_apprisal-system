package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "promotion_record")
public class PromotionRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private Long appraisalCycleId;
    
    private String oldDesignation;
    private String newDesignation;
    
    private Double oldSalary;
    private Double newSalary;
    
    private LocalDate effectiveDate;
    private Long approvedBy; // user ID
}
