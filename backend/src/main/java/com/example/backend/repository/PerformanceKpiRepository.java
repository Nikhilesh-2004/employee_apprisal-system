package com.example.backend.repository;

import com.example.backend.model.PerformanceKPI;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PerformanceKPIRepository extends JpaRepository<PerformanceKPI, Long> {
    List<PerformanceKPI> findByApplicableDesignation(String designation);
}
