package com.example.backend.repository;

import com.example.backend.model.AppraisalActionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppraisalActionLogRepository extends JpaRepository<AppraisalActionLog, Long> {
}
