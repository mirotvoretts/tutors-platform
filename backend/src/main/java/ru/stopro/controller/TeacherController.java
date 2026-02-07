package ru.stopro.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.stopro.domain.entity.User;
import ru.stopro.dto.student.StudentDto;
import ru.stopro.service.TeacherService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getMyStudents(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(teacherService.getStudentsByTeacherId(user.getId()));
    }

    @PostMapping("/students")
    public ResponseEntity<StudentDto> addStudent(
            @AuthenticationPrincipal User user,
            @RequestBody StudentDto studentDto
    ) {
        return ResponseEntity.ok(teacherService.addStudent(user.getId(), studentDto));
    }
}
