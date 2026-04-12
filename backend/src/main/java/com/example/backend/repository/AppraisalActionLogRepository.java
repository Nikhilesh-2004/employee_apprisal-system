package com.example.backend.repository;

import com.example.backend.model.AppraisalActionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppraisalActionLogRepository extends JpaRepository<AppraisalActionLog, Long> {
    List<AppraisalActionLog> findByAppraisalCycleIdAndEmployeeIdOrderByTimestampDesc(Long appraisalCycleId, Long employeeId);
}
