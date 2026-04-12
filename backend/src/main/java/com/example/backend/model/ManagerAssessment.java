package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "manager_assessment")
public class ManagerAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private Long appraisalCycleId;
    private Long managerId;
    private Long kpiId;
    
    private Integer managerRating;
    private String managerComments;
}
