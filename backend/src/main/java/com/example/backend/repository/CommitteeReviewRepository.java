package com.example.backend.repository;

import com.example.backend.model.CommitteeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CommitteeReviewRepository extends JpaRepository<CommitteeReview, Long> {
    Optional<CommitteeReview> findByEmployeeIdAndAppraisalCycleId(Long employeeId, Long appraisalCycleId);
}
