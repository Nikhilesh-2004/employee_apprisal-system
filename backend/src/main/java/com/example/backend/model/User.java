package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    
    // e.g. ADMIN, HR_MANAGER, MANAGER, EMPLOYEE, REVIEW_COMMITTEE
    private String role;
    
    private String department;
    private String designation;
    private LocalDate joiningDate;
    
    private Long managerId;
}
