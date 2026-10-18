---
name: nestjs-expert
description: "NestJS enterprise backend with dependency injection, TypeORM/Prisma, JWT auth, validation, and testing"
when_to_use: "Use when building a NestJS backend: DI, TypeORM/Prisma, JWT auth, validation, or tests."
version: "1.0.0"
category: [backend]
priority: high
phase: any
tech_stack:
  languages: [typescript]
  frameworks: [nestjs]
  databases: [postgresql, mysql, mongodb]
scale: [medium, large, enterprise]
auto_invoke:
  enabled: true
  conditions:
    - has_file: "**/nest-cli.json"
      reason: "NestJS project detected"
    - has_file: "**/src/main.ts"
      reason: "NestJS structure detected"
  skill_tier: context
triggers:
  phrases:
    - "nestjs"
    - "nest js"
    - "nest"
capabilities: [implementation, generation]
quality:
  rules_count: 15
  examples_count: 20
  stability: stable
integrates_with: [api-design, security, database]
dependencies: [typescript-pro, api-design]
source:
  origin: external
  sources: ["Jeffallan/claude-skills"]
author: Jeffallan
---

# NestJS Expert

A specialized skill for building enterprise-grade NestJS/TypeScript backends with dependency injection, TypeORM/Prisma, JWT/Passport auth, validation, Swagger docs, and testing.

## Core Workflow

1. **Analyze** — Analyze requirements and design module structure
2. **Implement** — Implement with proper DI wiring
3. **Secure** — Add guards and validation
4. **Verify** — Verify with linting and DI graph checks
5. **Test** — Test thoroughly

## Output Order

When implementing a feature, provide files in this order:
```
1. Module (entity, DTOs)
2. Controller
3. Service
4. Unit tests
```

## Module Structure
```typescript
// users.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
```

## Controller Pattern
```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }
}
```

## Service Pattern
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }
}
```

## DTOs with Validation
```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
```

## Guards & Auth
```typescript
// jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }
}
```

## Essential Practices

### MUST DO
- Use constructor injection — never `new` instances
- Validate all inputs with `ValidationPipe` and `class-validator`
- Use DTOs for all request/response bodies
- Throw typed exceptions (`NotFoundException`, `ConflictException`, etc.)
- Document endpoints with Swagger decorators
- Store config via `ConfigModule` — never hardcode credentials
- Use `class-transformer` for DTO transformation

### MUST NOT DO
- Expose passwords or secrets in responses
- Accept unvalidated input
- Create circular module dependencies
- Hardcode hostnames, ports, or credentials
- Use `@Body()` without validation
- Skip error handling
- Return database entities directly — use DTOs

## Testing
```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should find all users', async () => {
    const users = [{ id: 1, email: 'test@test.com' }];
    repository.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });
});
```

---

**Invoke:** `/nestjs-expert` | **Version:** 1.0.0
