package com.example.backend.repository;

import com.example.backend.model.SelfAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SelfAssessmentRepository extends JpaRepository<SelfAssessment, Long> {
    List<SelfAssessment> findByEmployeeIdAndAppraisalCycleId(Long employeeId, Long appraisalCycleId);
}
