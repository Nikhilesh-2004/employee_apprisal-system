package com.example.backend.controller;

import com.example.backend.model.CommitteeReview;
import com.example.backend.model.ManagerAssessment;
import com.example.backend.model.SelfAssessment;
import com.example.backend.service.AppraisalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
public class AppraisalController {

    @Autowired
    private AppraisalService appraisalService;

    @PostMapping("/self-assessment")
    public ResponseEntity<?> submitSelfAssessment(@RequestBody SelfAssessment assessment) {
        return ResponseEntity.ok(appraisalService.submitSelfAssessment(assessment));
    }

    @PostMapping("/manager-assessment")
    public ResponseEntity<?> submitManagerAssessment(@RequestBody ManagerAssessment assessment) {
        return ResponseEntity.ok(appraisalService.submitManagerAssessment(assessment));
    }

    @PostMapping("/committee-review")
    public ResponseEntity<?> submitCommitteeReview(@RequestBody CommitteeReview review) {
        return ResponseEntity.ok(appraisalService.submitCommitteeReview(review));
    }
}
