package com.example.backend.repository;

import com.example.backend.model.AppraisalCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AppraisalCycleRepository extends JpaRepository<AppraisalCycle, Long> {
    Optional<AppraisalCycle> findByStatus(AppraisalCycle.Status status);
}
