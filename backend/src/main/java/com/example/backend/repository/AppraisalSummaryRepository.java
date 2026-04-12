package com.example.backend.repository;

import com.example.backend.model.AppraisalSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppraisalSummaryRepository extends JpaRepository<AppraisalSummary, Long> {
    Optional<AppraisalSummary> findByEmployeeIdAndAppraisalCycleId(Long employeeId, Long appraisalCycleId);
}
