package com.example.backend.repository;

import com.example.backend.model.ManagerAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ManagerAssessmentRepository extends JpaRepository<ManagerAssessment, Long> {
    List<ManagerAssessment> findByEmployeeIdAndAppraisalCycleId(Long employeeId, Long appraisalCycleId);
}
