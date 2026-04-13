package com.example.backend.repository;

import com.example.backend.model.PromotionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PromotionRecordRepository extends JpaRepository<PromotionRecord, Long> {
    Optional<PromotionRecord> findByEmployeeIdAndCycleId(Long employeeId, Long cycleId);
}
