package com.example.backend.config;

import com.example.backend.model.AppraisalCycle;
import com.example.backend.model.PerformanceKpi;
import com.example.backend.model.User;
import com.example.backend.repository.AppraisalCycleRepository;
import com.example.backend.repository.PerformanceKpiRepository;
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
    private PerformanceKpiRepository kpiRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@test.com");
            admin.setPassword("password");
            admin.setRole("ADMIN");
            userRepository.save(admin);

            // Create HR
            User hr = new User();
            hr.setName("HR Manager");
            hr.setEmail("hr@test.com");
            hr.setPassword("password");
            hr.setRole("HR_MANAGER");
            userRepository.save(hr);

            // Create Manager
            User manager = new User();
            manager.setName("Manager User");
            manager.setEmail("manager@test.com");
            manager.setPassword("password");
            manager.setRole("MANAGER");
            userRepository.save(manager);
            
            // Create Review Committee
            User committee = new User();
            committee.setName("Committee User");
            committee.setEmail("committee@test.com");
            committee.setPassword("password");
            committee.setRole("REVIEW_COMMITTEE");
            userRepository.save(committee);

            // Create Employee
            User emp = new User();
            emp.setName("Employee User");
            emp.setEmail("emp@test.com");
            emp.setPassword("password");
            emp.setRole("EMPLOYEE");
            emp.setManagerId(manager.getId());
            userRepository.save(emp);

            // Create Appraisal Cycle
            AppraisalCycle cycle = new AppraisalCycle();
            cycle.setCycleName("Q1 2026 Appraisal");
            cycle.setStartDate(LocalDate.now());
            cycle.setEndDate(LocalDate.now().plusMonths(1));
            cycle.setStatus("ACTIVE");
            cycleRepository.save(cycle);

            // Create KPIs
            PerformanceKpi kpi1 = new PerformanceKpi();
            kpi1.setKpiName("Code Quality");
            kpi1.setCategory("Technical");
            kpi1.setWeightage(40.0);
            kpiRepository.save(kpi1);

            PerformanceKpi kpi2 = new PerformanceKpi();
            kpi2.setKpiName("Communication");
            kpi2.setCategory("Soft Skills");
            kpi2.setWeightage(30.0);
            kpiRepository.save(kpi2);
            
            System.out.println("Mock Data Seeded Successfully!");
        }
    }
}
