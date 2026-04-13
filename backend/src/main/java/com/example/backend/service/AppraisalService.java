package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AppraisalService {
    @Autowired private AppraisalCycleRepository cycleRepository;
    @Autowired private PerformanceKPIRepository kpiRepository;
    @Autowired private SelfAssessmentRepository selfAssessmentRepository;
    @Autowired private ManagerAssessmentRepository managerAssessmentRepository;
    @Autowired private CommitteeReviewRepository committeeReviewRepository;
    @Autowired private AppraisalSummaryRepository summaryRepository;
    @Autowired private PromotionRecordRepository promotionRepository;

    // Cycle Management
    public AppraisalCycle createCycle(AppraisalCycle cycle) {
        cycle.setStatus(AppraisalCycle.Status.DRAFT);
        return cycleRepository.save(cycle);
    }

    public AppraisalCycle updateCycleStatus(Long id, AppraisalCycle.Status status) {
        AppraisalCycle cycle = cycleRepository.findById(id).orElseThrow();
        cycle.setStatus(status);
        return cycleRepository.save(cycle);
    }

    public List<AppraisalCycle> getAllCycles() {
        return cycleRepository.findAll();
    }

    // KPI Management
    public boolean isSelfAssessmentSubmitted(Long employeeId, Long cycleId) {
        return !selfAssessmentRepository.findByEmployeeIdAndCycleId(employeeId, cycleId).isEmpty();
    }

    public PerformanceKPI createKPI(PerformanceKPI kpi) {
        return kpiRepository.save(kpi);
    }

    public List<PerformanceKPI> getAllKPIs() {
        return kpiRepository.findAll();
    }

    // Assessments
    public SelfAssessment submitSelfAssessment(SelfAssessment assessment) {
        // Logic check: Cycle must be ACTIVE or SELF_ASSESSMENT
        AppraisalCycle cycle = cycleRepository.findById(assessment.getCycle().getId()).orElseThrow();
        if (cycle.getStatus() != AppraisalCycle.Status.ACTIVE && cycle.getStatus() != AppraisalCycle.Status.SELF_ASSESSMENT) {
            throw new RuntimeException("Cycle is not in Assessment phase");
        }
        assessment.setStatus(SelfAssessment.Status.SUBMITTED);
        return selfAssessmentRepository.save(assessment);
    }

    public ManagerAssessment submitManagerAssessment(ManagerAssessment assessment) {
        return managerAssessmentRepository.save(assessment);
    }

    public CommitteeReview submitCommitteeReview(CommitteeReview review) {
        CommitteeReview saved = committeeReviewRepository.save(review);
        calculateFinalScore(review.getEmployee().getId(), review.getCycle().getId());
        return saved;
    }

    @Transactional
    public void calculateFinalScore(Long employeeId, Long cycleId) {
        List<SelfAssessment> self = selfAssessmentRepository.findByEmployeeIdAndCycleId(employeeId, cycleId);
        List<ManagerAssessment> manager = managerAssessmentRepository.findByEmployeeIdAndCycleId(employeeId, cycleId);
        Optional<CommitteeReview> committee = committeeReviewRepository.findByEmployeeIdAndCycleId(employeeId, cycleId);

        double selfWeightSum = self.stream().mapToDouble(a -> a.getKpi().getWeightage()).sum();
        double selfScore = selfWeightSum > 0 ? self.stream().mapToDouble(a -> a.getRating() * a.getKpi().getWeightage()).sum() / selfWeightSum : 0;

        double managerWeightSum = manager.stream().mapToDouble(a -> a.getKpi().getWeightage()).sum();
        double managerScore = managerWeightSum > 0 ? manager.stream().mapToDouble(a -> a.getRating() * a.getKpi().getWeightage()).sum() / managerWeightSum : 0;

        double committeeScore = committee.isPresent() ? committee.get().getFinalRating() : 0;
        double finalScore = (selfScore * 0.2) + (managerScore * 0.4) + (committeeScore * 0.4);

        AppraisalSummary summary = summaryRepository.findByEmployeeIdAndCycleId(employeeId, cycleId)
                .orElse(new AppraisalSummary());
        
        summary.setEmployee(new User()); summary.getEmployee().setId(employeeId);
        summary.setCycle(new AppraisalCycle()); summary.getCycle().setId(cycleId);
        summary.setSelfScore(selfScore);
        summary.setManagerScore(managerScore);
        summary.setCommitteeScore(committee.isPresent() ? committee.get().getFinalRating() : null);
        summary.setFinalScore(finalScore);
        summary.setPromotionRecommended(finalScore >= 4.0);
        
        summaryRepository.save(summary);
    }

    public List<AppraisalSummary> getSummaries(Long cycleId) {
        return summaryRepository.findByCycleId(cycleId);
    }

    public PromotionRecord approvePromotion(PromotionRecord record) {
        return promotionRepository.save(record);
    }
}
