---
name: java-pro
description: "Java enterprise backend patterns with Spring Boot, Jakarta EE, Maven/Gradle, and testing best practices."
when_to_use: "Use when building Java backends with Spring Boot or Jakarta EE and Maven/Gradle."
version: "1.0.0"
category: [backend]
priority: high
phase: any
tech_stack:
  languages: [java, kotlin]
  frameworks: [spring-boot, spring, jakarta-ee, quarkus, micronaut]
  build: [maven, gradle]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/pom.xml"
      reason: "Maven project detected"
    - has_file: "**/build.gradle*"
      reason: "Gradle project detected"
    - has_file: "**/src/main/java/**"
      reason: "Java source code detected"
    - tech_stack: [spring-boot, jakarta-ee, quarkus, micronaut]
      reason: "Java framework detected"
  skill_tier: context
triggers:
  phrases:
    - "spring boot"
    - "spring"
    - "java"
    - "maven"
    - "gradle"
    - "jakarta"
    - "quarkus"
    - "micronaut"
    - "hibernate"
    - "jpa"
    - "thymeleaf"
capabilities: [implementation, review, generation]
dependencies: [api-design, security, database]
integrates_with: [auto-router, api-design, security, database]
---

# JAVA-PRO v1.0

Java enterprise backend specialist. Use these rules for Spring Boot, Jakarta EE, and Java-based backend development.

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Framework | Spring Boot, Spring MVC, Spring Security, Spring Data |
| Build | Maven, Gradle |
| Database | JPA, Hibernate, Spring Data JPA |
| API | REST, GraphQL (Spring GraphQL) |
| Testing | JUnit 5, Mockito, TestContainers |
| Observability | Micrometer, Actuator, OpenTelemetry |

## Core Patterns

### 1. Project Structure

```
src/
├── main/
│   ├── java/com/example/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Data access
│   │   ├── model/           # Entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── mapper/          # Entity-DTO mappers
│   │   ├── exception/       # Exception handling
│   │   └── Application.java  # Main class
│   └── resources/
│       ├── application.yml   # Spring config
│       └── db/migration/    # Flyway/Liquibase
└── test/
    └── java/com/example/     # Test classes
```

### 2. REST Controller Pattern

```java
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse created = userService.create(request);
        return ResponseEntity.created(URI.create("/api/v1/users/" + created.getId()))
            .body(created);
    }
}
```

### 3. Service Layer Pattern

```java
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .build();

        return userRepository.save(user).toResponse();
    }
}
```

### 4. Repository Pattern

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findActiveUsers();

    @EntityGraph(attributePaths = {"roles", "profile"})
    Optional<User> findWithDetailsById(Long id);
}
```

### 5. Exception Handling

```java
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse.of(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value"
            ));
        return ResponseEntity.badRequest()
            .body(ValidationErrorResponse.of(errors));
    }
}
```

## Configuration

### application.yml

```yaml
spring:
  application:
    name: my-service
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  flyway:
    enabled: true
    baseline-on-migrate: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
```

## Testing

### Unit Test

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_shouldEncodePassword() {
        CreateUserRequest request = new CreateUserRequest("test@example.com", "password123", "Test User");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserResponse response = userService.create(request);

        assertThat(response.getEmail()).isEqualTo("test@example.com");
        verify(passwordEncoder).encode("password123");
    }
}
```

### Integration Test with TestContainers

```java
@Testcontainers
@SpringBootTest
class UserRepositoryIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @Test
    void findByEmail_shouldReturnUser() {
        Optional<User> user = userRepository.findByEmail("existing@example.com");
        assertThat(user).isPresent();
    }
}
```

## Security

### Spring Security Configuration

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

## Best Practices

1. **Use constructor injection** - Never use `@Autowired` on fields
2. **Always use `@Transactional(readOnly = true)`** for read operations
3. **Use DTOs** - Never expose entities directly
4. **Use MapStruct** for entity-DTO mapping
5. **Use Flyway** for database migrations
6. **Use Micrometer** for metrics, not raw logging
7. **Use `@Validated`** on controller level for group validation
8. **Use pagination** for list endpoints - never return unbounded lists

---

*Author: TheVoidSyntax*
