package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "performance_kpi")
@Data
public class PerformanceKPI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kpi_name", nullable = false)
    private String kpiName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer weightage;

    @Column(name = "applicable_designation")
    private String applicableDesignation;

    public enum Category {
        TECHNICAL, SOFT_SKILL, MANAGERIAL
    }
}
