package com.example.backend.config;

import com.example.backend.model.AppraisalCycle;
import com.example.backend.model.PerformanceKPI;
import com.example.backend.model.User;
import com.example.backend.repository.AppraisalCycleRepository;
import com.example.backend.repository.PerformanceKPIRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppraisalCycleRepository cycleRepository;

    @Autowired
    private PerformanceKPIRepository kpiRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Manager
            User manager = new User();
            manager.setName("Manager User");
            manager.setEmail("manager@test.com");
            manager.setPassword("password");
            manager.setRole(User.Role.MANAGER);
            userRepository.save(manager);

            // Create Admin
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword("password");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            // Create HR
            User hr = new User();
            hr.setName("HR Manager");
            hr.setEmail("hr@test.com");
            hr.setPassword("password");
            hr.setRole(User.Role.HR_MANAGER);
            userRepository.save(hr);
            
            // Create Review Committee
            User committee = new User();
            committee.setName("Committee User");
            committee.setEmail("committee@test.com");
            committee.setPassword("password");
            committee.setRole(User.Role.REVIEW_COMMITTEE);
            userRepository.save(committee);

            // Create Employee
            User emp1 = new User();
            emp1.setName("Employee One");
            emp1.setEmail("emp1@test.com");
            emp1.setPassword("password");
            emp1.setRole(User.Role.EMPLOYEE);
            emp1.setManager(manager);
            emp1.setDesignation("Software Engineer");
            userRepository.save(emp1);

            User emp2 = new User();
            emp2.setName("Employee Two");
            emp2.setEmail("emp2@test.com");
            emp2.setPassword("password");
            emp2.setRole(User.Role.EMPLOYEE);
            emp2.setManager(manager);
            emp2.setDesignation("QA Engineer");
            userRepository.save(emp2);

            // Create Appraisal Cycle
            AppraisalCycle cycle = new AppraisalCycle();
            cycle.setCycleName("Annual Appraisal 2026");
            cycle.setStartDate(LocalDate.now());
            cycle.setEndDate(LocalDate.now().plusMonths(3));
            cycle.setStatus(AppraisalCycle.Status.ACTIVE);
            cycleRepository.save(cycle);

            // Create KPIs with exact Enum matching
            PerformanceKPI kpi1 = new PerformanceKPI();
            kpi1.setKpiName("Technical Proficiency");
            kpi1.setCategory(PerformanceKPI.Category.TECHNICAL);
            kpi1.setWeightage(50);
            kpiRepository.save(kpi1);

            PerformanceKPI kpi2 = new PerformanceKPI();
            kpi2.setKpiName("Team Collaboration");
            kpi2.setCategory(PerformanceKPI.Category.SOFT_SKILL);
            kpi2.setWeightage(30);
            kpiRepository.save(kpi2);

            PerformanceKPI kpi3 = new PerformanceKPI();
            kpi3.setKpiName("Leadership");
            kpi3.setCategory(PerformanceKPI.Category.MANAGERIAL);
            kpi3.setWeightage(20);
            kpiRepository.save(kpi3);
            
            System.out.println("Enhanced Mock Data Seeded Successfully!");
        }
    }
}
