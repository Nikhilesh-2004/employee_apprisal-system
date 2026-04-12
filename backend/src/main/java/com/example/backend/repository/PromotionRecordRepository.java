package com.example.backend.repository;

import com.example.backend.model.PromotionRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRecordRepository extends JpaRepository<PromotionRecord, Long> {
}
