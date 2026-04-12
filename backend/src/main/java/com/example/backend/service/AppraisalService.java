package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppraisalService {

    @Autowired
    private AppraisalCycleRepository appraisalCycleRepository;
    @Autowired
    private SelfAssessmentRepository selfAssessmentRepository;
    @Autowired
    private ManagerAssessmentRepository managerAssessmentRepository;
    @Autowired
    private CommitteeReviewRepository committeeReviewRepository;
    @Autowired
    private AppraisalActionLogRepository logRepository;
    
    // Cycle Management
    public AppraisalCycle createCycle(AppraisalCycle cycle) {
        return appraisalCycleRepository.save(cycle);
    }
    
    public List<AppraisalCycle> getAllCycles() {
        return appraisalCycleRepository.findAll();
    }

    // Self Assessment
    public SelfAssessment submitSelfAssessment(SelfAssessment selfAssessment) {
        SelfAssessment saved = selfAssessmentRepository.save(selfAssessment);
        logAction(selfAssessment.getAppraisalCycleId(), selfAssessment.getEmployeeId(), 
            "SUBMITTED_SELF_ASSESSMENT", selfAssessment.getEmployeeId(), "PENDING", "SUBMITTED");
        return saved;
    }

    // Manager Assessment
    public ManagerAssessment submitManagerAssessment(ManagerAssessment managerAssessment) {
        ManagerAssessment saved = managerAssessmentRepository.save(managerAssessment);
        logAction(managerAssessment.getAppraisalCycleId(), managerAssessment.getEmployeeId(), 
            "SUBMITTED_MANAGER_REVIEW", managerAssessment.getManagerId(), "PENDING_MANAGER", "REVIEWED_BY_MANAGER");
        return saved;
    }

    // Committee Review
    public CommitteeReview submitCommitteeReview(CommitteeReview committeeReview) {
        CommitteeReview saved = committeeReviewRepository.save(committeeReview);
        logAction(committeeReview.getAppraisalCycleId(), committeeReview.getEmployeeId(), 
            "FINALIZED_COMMITTEE_REVIEW", committeeReview.getReviewedBy(), "PENDING_COMMITTEE", "FINALIZED");
        return saved;
    }

    private void logAction(Long cycleId, Long empId, String action, Long by, String oldStatus, String newStatus) {
        AppraisalActionLog log = new AppraisalActionLog();
        log.setAppraisalCycleId(cycleId);
        log.setEmployeeId(empId);
        log.setAction(action);
        log.setPerformedBy(by);
        log.setOldStatus(oldStatus);
        log.setNewStatus(newStatus);
        log.setTimestamp(LocalDateTime.now());
        logRepository.save(log);
    }
}
