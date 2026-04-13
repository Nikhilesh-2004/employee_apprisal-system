package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.service.AppraisalService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AppraisalController {
    @Autowired private AppraisalService appraisalService;
    @Autowired private UserService userService;

    // Users
    @GetMapping("/users")
    public List<User> getUsers() { return userService.getAllUsers(); }

    @GetMapping("/users/team/{managerId}")
    public List<User> getTeam(@PathVariable Long managerId) { return userService.getTeam(managerId); }

    // Cycles
    @GetMapping("/cycles")
    public List<AppraisalCycle> getCycles() { return appraisalService.getAllCycles(); }

    @PostMapping("/cycles")
    public AppraisalCycle createCycle(@RequestBody AppraisalCycle cycle) { return appraisalService.createCycle(cycle); }

    @PutMapping("/cycles/{id}/status")
    public AppraisalCycle updateCycleStatus(@PathVariable Long id, @RequestParam AppraisalCycle.Status status) {
        return appraisalService.updateCycleStatus(id, status);
    }

    // KPIs
    @GetMapping("/kpis")
    public List<PerformanceKPI> getKPIs() { return appraisalService.getAllKPIs(); }

    @PostMapping("/kpis")
    public PerformanceKPI createKPI(@RequestBody PerformanceKPI kpi) { return appraisalService.createKPI(kpi); }

    // Assessments
    @GetMapping("/self-assessments/status/{employeeId}/{cycleId}")
    public ResponseEntity<Boolean> getSelfAssessmentStatus(@PathVariable Long employeeId, @PathVariable Long cycleId) {
        return ResponseEntity.ok(appraisalService.isSelfAssessmentSubmitted(employeeId, cycleId));
    }

    @PostMapping("/self-assessments")
    public SelfAssessment submitSelf(@RequestBody SelfAssessment sa) { return appraisalService.submitSelfAssessment(sa); }

    @PostMapping("/manager-assessments")
    public ManagerAssessment submitManager(@RequestBody ManagerAssessment ma) { return appraisalService.submitManagerAssessment(ma); }

    // Reviews
    @PostMapping("/committee-reviews")
    public CommitteeReview submitReview(@RequestBody CommitteeReview cr) { return appraisalService.submitCommitteeReview(cr); }

    // Summary & Promotions
    @GetMapping("/summaries/{cycleId}")
    public List<AppraisalSummary> getSummaries(@PathVariable Long cycleId) { return appraisalService.getSummaries(cycleId); }

    @PostMapping("/promotions/approve")
    public PromotionRecord approvePromotion(@RequestBody PromotionRecord pr) { return appraisalService.approvePromotion(pr); }
}
