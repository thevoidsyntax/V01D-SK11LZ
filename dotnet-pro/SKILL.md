---
name: dotnet-pro
description: ".NET Core and ASP.NET patterns with C#, Entity Framework Core, and testing best practices."
version: "1.0.0"
category: [backend]
priority: high
phase: any
tech_stack:
  languages: [csharp, fsharp]
  frameworks: [aspnet-core, blazor, maui, xamarin]
  orm: [entity-framework-core, dapper, nhibernate]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/*.csproj"
      reason: ".NET project detected"
    - has_file: "**/Program.cs"
      reason: ".NET application detected"
    - tech_stack: [aspnet-core, blazor]
      reason: "ASP.NET Core detected"
  skill_tier: context
triggers:
  phrases:
    - "asp.net"
    - ".net"
    - "dotnet"
    - "c#"
    - "ef core"
    - "entity framework"
    - "nuget"
    - "blazor"
    - "webapi"
    - "mvc"
capabilities: [implementation, review, generation]
dependencies: [api-design, security, database]
integrates_with: [auto-router, api-design, security, database]
---

# DOTNET-PRO v1.0

.NET Core enterprise backend specialist. Use these rules for ASP.NET Core, Entity Framework Core, and C# backend development.

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Framework | ASP.NET Core 8, Minimal APIs, gRPC |
| ORM | Entity Framework Core, Dapper |
| DI | Built-in DI, Scrutor |
| Testing | xUnit, NUnit, Moq, FluentAssertions |
| API | REST, GraphQL (HotChocolate), gRPC |
| Observability | OpenTelemetry, Serilog, Health Checks |

## Core Patterns

### 1. Project Structure

```
src/
├── MyApp.Api/              # Web API project
│   ├── Controllers/
│   ├── Middleware/
│   ├── Filters/
│   └── Program.cs
├── MyApp.Core/            # Domain/Business logic
│   ├── Entities/
│   ├── Interfaces/
│   ├── Services/
│   └── DTOs/
├── MyApp.Infrastructure/   # Data access
│   ├── Data/
│   ├── Repositories/
│   └── Migrations/
└── MyApp.Tests/            # Unit/Integration tests
    ├── Unit/
    └── Integration/
```

### 2. Minimal API Pattern

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

var app = builder.Build();

// Minimal API endpoints
app.MapGet("/api/users", async (IUserService service) =>
    Results.Ok(await service.GetAllAsync()));

app.MapGet("/api/users/{id:int}", async (int id, IUserService service) =>
{
    var user = await service.GetByIdAsync(id);
    return user is null ? Results.NotFound() : Results.Ok(user);
});

app.MapPost("/api/users", async (CreateUserRequest request, IUserService service) =>
{
    var created = await service.CreateAsync(request);
    return Results.Created($"/api/users/{created.Id}", created);
});

app.Run();
```

### 3. Service Layer Pattern

```csharp
public interface IUserService
{
    Task<UserResponse?> GetByIdAsync(int id);
    Task<IEnumerable<UserResponse>> GetAllAsync();
    Task<UserResponse> CreateAsync(CreateUserRequest request);
}

public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {
        if (await _repository.ExistsByEmailAsync(request.Email))
            throw new EmailAlreadyExistsException(request.Email);

        var user = _mapper.Map<User>(request);
        user.PasswordHash = BCrypt.HashPassword(request.Password);

        await _repository.AddAsync(user);
        await _repository.SaveChangesAsync();

        return _mapper.Map<UserResponse>(user);
    }
}
```

### 4. Repository Pattern

```csharp
public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<IEnumerable<User>> GetAllAsync();
    Task AddAsync(User user);
    Task<bool> ExistsByEmailAsync(string email);
    Task SaveChangesAsync();
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context) => _context = context;

    public async Task<User?> GetByIdAsync(int id) =>
        await _context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.Id == id);

    public async Task<bool> ExistsByEmailAsync(string email) =>
        await _context.Users.AnyAsync(u => u.Email == email);
}
```

### 5. Entity Configuration

```csharp
public class User : BaseEntity
{
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; } = true;
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasIndex(u => u.Email).IsUnique();

        builder.Property(u => u.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasMany(u => u.UserRoles)
            .WithOne(ur => ur.User)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

### 6. Error Handling Middleware

```csharp
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            EmailAlreadyExistsException => (StatusCodes.Status409Conflict, exception.Message),
            ValidationException ve => (StatusCodes.Status400BadRequest, ve.Message),
            _ => (StatusCodes.Status500InternalServerError, "An error occurred")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ErrorResponse(statusCode, message);
        await context.Response.WriteAsJsonAsync(response);
    }
}
```

## Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Database=mydb;Username=user;Password=pass"
  },
  "Jwt": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "my-api",
    "Audience": "my-api-clients",
    "ExpiryMinutes": 60
  },
  "Logging": {
    "Serilog": {
      "MinimumLevel": {
        "Default": "Information",
        "Override": {
          "Microsoft": "Warning"
        }
      }
    }
  }
}
```

## Testing

### Unit Test with xUnit

```csharp
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _repositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly UserService _service;

    public UserServiceTests()
    {
        _repositoryMock = new Mock<IUserRepository>();
        _mapperMock = new Mock<IMapper>();
        _service = new UserService(_repositoryMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task CreateAsync_WithValidRequest_ReturnsCreatedUser()
    {
        // Arrange
        var request = new CreateUserRequest("test@example.com", "password", "Test");
        var user = new User { Email = request.Email };
        var response = new UserResponse { Email = request.Email };

        _repositoryMock.Setup(r => r.ExistsByEmailAsync(request.Email))
            .ReturnsAsync(false);
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<User>()))
            .Returns(Task.CompletedTask);
        _mapperMock.Setup(m => m.Map<User>(request)).Returns(user);
        _mapperMock.Setup(m => m.Map<UserResponse>(user)).Returns(response);

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        result.Email.Should().Be(request.Email);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
```

### Integration Test with Testcontainers

```csharp
[Collection("Database")]
public class UserRepositoryTests
{
    private readonly PostgreSqlFixture _fixture;

    public UserRepositoryTests(PostgreSqlFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task GetByIdAsync_WithExistingUser_ReturnsUser()
    {
        // Arrange
        using var connection = new NpgsqlConnection(_fixture.ConnectionString);
        var repository = new UserRepository(connection);
        var userId = await repository.AddAsync(new User { Email = "test@test.com" });

        // Act
        var user = await repository.GetByIdAsync(userId);

        // Assert
        user.Should().NotBeNull();
        user!.Email.Should().Be("test@test.com");
    }
}
```

## Best Practices

1. **Use Minimal APIs** for simple endpoints, Controllers for complex ones
2. **Use CQRS** with MediatR for complex business logic
3. **Use FluentAssertions** for readable test assertions
4. **Use Dapper** for high-performance queries
5. **Use Health Checks** for container orchestration
6. **Use Serilog** with structured logging
7. **Use Records** for DTOs (immutability)
8. **Use CancellationTokens** for async operations
9. **Use Global Exception Handler** middleware
10. **Use Environment Variables** for secrets, not config files

---

*Author: TheVoidSyntax*
