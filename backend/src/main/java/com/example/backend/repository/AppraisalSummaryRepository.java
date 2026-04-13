package com.example.backend.repository;

import com.example.backend.model.AppraisalSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface AppraisalSummaryRepository extends JpaRepository<AppraisalSummary, Long> {
    Optional<AppraisalSummary> findByEmployeeIdAndCycleId(Long employeeId, Long cycleId);
    List<AppraisalSummary> findByCycleId(Long cycleId);
}
