# Employee Performance Appraisal & Promotion System

A comprehensive full-stack application for managing employee performance cycles, KPI tracking, role-based assessments, and promotion workflows.

## 🚀 Overview

This system streamlines the organizational appraisal process by providing distinct dashboards for Employees, Managers, HR, and Review Committees. It features real-time performance calculation, automated promotion eligibility checks, and a secure role-based access control system.

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Build Tool**: Maven
- **Port**: 8081

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Modern, Responsive Design)
- **Port**: 5173

## ✨ Key Features

- **Role-Based Access Control**:
  - **Employee**: Submit self-assessments and view appraisal status.
  - **Manager**: Assess team members and provide detailed feedback.
  - **HR Manager**: Manage appraisal cycles (Draft -> Active -> Completed) and KPIs.
  - **Review Committee**: Override ratings, provide final decisions, and recommend promotions.
  - **Admin**: Full user management and system configuration.
- **Dynamic Scoring Engine**: 
  - Normalizes scores based on varying KPI weightages.
  - Standardized weighting: 20% Self / 40% Manager / 40% Committee.
- **Cycle Management**: Create and track specific appraisal periods.
- **Promotion Workflow**: Automated recommendation logic with final approval tracking.

## ⚙️ Setup & Installation

### 1. Database Configuration
Create a database named `employee` in your MySQL server:
```sql
CREATE DATABASE employee;
```
Ensure your `backend/src/main/resources/application.properties` matches your MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 2. Run the Backend
Navigate to the `backend` directory and run:
```bash
mvn spring-boot:run
```

### 3. Run the Frontend
Navigate to the `frontend` directory and run:
```bash
npm install
npm run dev
```

## 👥 Default Accounts (Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | `password` |
| **HR Manager** | `hr@test.com` | `password` |
| **Manager** | `manager@test.com` | `password` |
| **Employee** | `emp1@test.com` | `password` |
| **Review Committee** | `committee@test.com` | `password` |

## 📐 Scoring Formula
The system uses a normalized weighted average:
- **Component Score** = (Σ (Rating × Weight)) / (Σ Weight)
- **Final Score** = (Self × 0.2) + (Manager × 0.4) + (Committee × 0.4)
