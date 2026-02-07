package ru.stopro.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.stopro.domain.entity.Student;
import ru.stopro.domain.entity.Teacher;
import ru.stopro.domain.entity.User;
import ru.stopro.domain.enums.UserRole;
import ru.stopro.dto.student.StudentDto;
import ru.stopro.repository.StudentRepository;
import ru.stopro.repository.TeacherRepository;
import ru.stopro.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<StudentDto> getStudentsByTeacherId(UUID teacherUserId) {
        Teacher teacher = teacherRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Учитель не найден"));
        
        return studentRepository.findByTeacherId(teacher.getId()).stream()
                .map(StudentDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDto addStudent(UUID teacherUserId, StudentDto dto) {
        Teacher teacher = teacherRepository.findByUserId(teacherUserId)
                .orElseThrow(() -> new RuntimeException("Учитель не найден"));

        // Создаем пользователя для ученика (заглушка, в реальности нужно отправлять приглашение)
        User user = User.builder()
                .email(dto.getEmail())
                .passwordHash("temp_hash") // В реальности генерируется и отправляется на почту
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .role(UserRole.STUDENT)
                .isActive(true)
                .dataProcessingConsent(true) // В реальности должно быть false до подтверждения
                .build();
        
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .teacher(teacher)
                .grade(dto.getGrade())
                .targetScore(dto.getTargetScore() != null ? dto.getTargetScore() : 70)
                .level(dto.getLevel())
                .build();

        student = studentRepository.save(student);
        
        return StudentDto.fromEntity(student);
    }
}
