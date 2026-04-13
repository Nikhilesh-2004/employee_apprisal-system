package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllEmployees() {
        return userRepository.findByRole(User.Role.EMPLOYEE);
    }

    public List<User> getEmployeesByManager(Long managerId) {
        return userRepository.findByManagerId(managerId);
    }

    public User createEmployee(User user) {
        user.setRole(User.Role.EMPLOYEE);
        return userRepository.save(user);
    }

    public User updateEmployee(Long id, User updatedUser) {
        return userRepository.findById(id).map(u -> {
            u.setName(updatedUser.getName());
            u.setEmail(updatedUser.getEmail());
            u.setDepartment(updatedUser.getDepartment());
            u.setDesignation(updatedUser.getDesignation());
            u.setJoiningDate(updatedUser.getJoiningDate());
            u.setManager(updatedUser.getManager());
            return userRepository.save(u);
        }).orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    public void deleteEmployee(Long id) {
        userRepository.deleteById(id);
    }
}
