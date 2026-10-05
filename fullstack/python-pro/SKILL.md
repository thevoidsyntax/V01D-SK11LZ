---
name: python-pro
description: "Python best practices including typing, idiomatic patterns, and professional Python development."
version: "1.0"
---

# PYTHON PRO SKILL
# Python Best Practices, Typing & Idiomatic Patterns

Kamu adalah Python Pro Specialist. Gunakan rules ini untuk setiap aspek Python development.

---

## 1. TYPE HINTS & ANNOTATIONS

### Basic Type Hints
```python
# Primitive types
def greet(name: str) -> str:
    return f"Hello, {name}"

# Optional types
def find_user(user_id: int) -> User | None:
    ...

# Union types
def parse_value(value: str | int | float) -> float:
    return float(value)

# Type aliases untuk readability
from typing import TypeAlias

UserId: TypeAlias = int
PhoneNumber: TypeAlias = str
Contacts: TypeAlias = list[Contact]

# Generic types
from typing import TypeVar, Generic

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("Stack is empty")
        return self._items.pop()
```

### Advanced Type Patterns
```python
# Callable types
from typing import Callable

Callback: TypeAlias = Callable[[int, str], None]
AsyncCallback: TypeAlias = Callable[[int], Awaitable[str]]

# Protocol untuk structural typing
from typing import Protocol, runtime_checkable

@runtime_checkable
class Readable(Protocol):
    def read(self, n: int = -1) -> bytes:
        ...

# TypedDict untuk dict schemas
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str
    tags: list[str]

# NewType untuk domain types
from typing import NewType

UserId = NewType("UserId", int)
ContactPhone = NewType("ContactPhone", str)

def get_user(user_id: UserId) -> User:
    ...
```

### Type Guard & Narrowing
```python
from typing import TypeGuard

def is_string_list(val: list[object]) -> TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in val)

# Using TypeGuard
items: list[object]
if is_string_list(items):
    # Type narrowing: items is list[str] here
    print(items[0].upper())
```

---

## 2. IDIOMATIC PATTERNS

### Early Returns & Guard Clauses
```python
# BAD - Nested if-else
def process_user(user: User | None) -> str:
    if user is not None:
        if user.is_active:
            if user.email:
                return send_email(user.email)
            else:
                return "No email"
        else:
            return "User inactive"
    else:
        return "No user"

# GOOD - Early returns / Guard clauses
def process_user(user: User | None) -> str:
    if user is None:
        return "No user"

    if not user.is_active:
        return "User inactive"

    if not user.email:
        return "No email"

    return send_email(user.email)
```

### Context Managers & Resource Management
```python
# Class-based context manager
class DatabaseConnection:
    def __enter__(self) -> "DatabaseConnection":
        self.conn = connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        self.conn.close()
        return False  # Don't suppress exceptions

# Using context manager
with DatabaseConnection() as db:
    db.execute("SELECT * FROM users")

# Multiple context managers
with open("input.txt") as f_in, open("output.txt", "w") as f_out:
    f_out.write(f_in.read())

# contextlib shortcuts
from contextlib import contextmanager, suppress

@contextmanager
def temporary_file(path: str):
    """Create and auto-cleanup temporary file."""
    f = open(path, "w")
    try:
        yield f
    finally:
        f.close()
        os.remove(path)

# suppress example
with suppress(FileNotFoundError):
    os.remove("nonexistent.txt")
```

### Comprehensions & Generator Expressions
```python
# List comprehension - simple case
squares = [x**2 for x in range(10)]

# Set comprehension
unique_tags = {tag for tag in all_tags if tag}

# Dict comprehension
word_lengths = {word: len(word) for word in words}

# Generator expression - memory efficient
total = sum(x**2 for x in range(10_000_000))

# Nested comprehension
matrix = [[i * j for j in range(5)] for i in range(5)]

# Generator function
def fibonacci(n: int) -> Generator[int, None, None]:
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# BAD - Avoid side effects in comprehensions
results = [process(item) for item in items]  # If process is void

# GOOD - Use loop if processing has side effects
for item in items:
    process(item)
```

### Pattern Matching (Python 3.10+)
```python
# Structural pattern matching
def handle_command(command: Command) -> Response:
    match command:
        case Click(x=x, y=y):
            return handle_click(x, y)
        case KeyPress(key="Enter"):
            return handle_enter()
        case KeyPress(key=key) if key.isalpha():
            return handle_alpha_key(key)
        case Scroll(dx=0, dy=0):
            return Response(status="noop")
        case _:
            return Response(status="unknown")

# Match with classes
class Point:
    def __init__(self, x: float, y: float) -> None:
        self.x = x
        self.y = y

def classify_point(point: Point) -> str:
    match point:
        case Point(x=0, y=0):
            return "origin"
        case Point(x=x, y=0) if x > 0:
            return "positive x-axis"
        case Point(x=0, y=y) if y > 0:
            return "positive y-axis"
        case Point():
            return "somewhere else"
```

---

## 3. ERROR HANDLING

### Exception Best Practices
```python
# Specific exception hierarchy
class AppError(Exception):
    """Base exception for application errors."""
    pass

class ValidationError(AppError):
    """Input validation failed."""
    pass

class ResourceNotFoundError(AppError):
    """Requested resource not found."""
    pass

# Custom exceptions with context
class CampaignError(AppError):
    def __init__(
        self,
        message: str,
        campaign_id: str | None = None,
        contact_count: int = 0
    ) -> None:
        super().__init__(message)
        self.campaign_id = campaign_id
        self.contact_count = contact_count

# Raising with context
raise CampaignError(
    "Campaign failed to start",
    campaign_id=campaign.id,
    contact_count=len(contacts)
) from original_error  # Chain exceptions

# Handling with exception groups (Python 3.11+)
try:
    process_batch(items)
except* (ValidationError, ProcessingError) as eg:
    print(f"Got {len(eg.exceptions)} errors:")
    for e in eg.exceptions:
        print(f"  - {e}")
```

### Try-Except-Else-Finally
```python
# Comprehensive pattern
def read_config(path: str) -> Config:
    config_file = None
    try:
        config_file = open(path)
        content = config_file.read()
        config = parse_config(content)
    except FileNotFoundError:
        logger.warning(f"Config not found: {path}, using defaults")
        config = Config.default()
    except json.JSONDecodeError as e:
        raise ConfigError(f"Invalid config format: {e}") from e
    else:
        logger.info("Config loaded successfully")
    finally:
        if config_file:
            config_file.close()
    return config
```

---

## 4. DATA CLASSES & DATACLASS

### Basic Dataclass
```python
from dataclasses import dataclass, field

@dataclass
class Contact:
    name: str
    phone: str
    email: str | None = None
    tags: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)

    @property
    def display_name(self) -> str:
        return self.name or "Unknown"

    def is_valid(self) -> bool:
        return bool(self.phone and self.phone.startswith(("0", "+")))
```

### Advanced Dataclass Patterns
```python
from dataclasses import dataclass, field
from typing import ClassVar

@dataclass(order=True, frozen=True)
class Message:
    """Immutable message entity."""
    sort_index: tuple[int, int] = field(init=False)
    id: int
    content: str
    sender: str
    timestamp: datetime

    def __post_init__(self) -> None:
        # Sort by timestamp (newest first)
        self.sort_index = (-self.timestamp.timestamp(), self.id)

@dataclass
class Campaign:
    """Campaign with mutable state but immutable identity."""
    id: str
    name: str
    template: str
    contacts: list[Contact] = field(default_factory=list)

    # Class variable
    MAX_CONTACTS: ClassVar[int] = 10000

    def add_contacts(self, new_contacts: list[Contact]) -> None:
        if len(self.contacts) + len(new_contacts) > self.MAX_CONTACTS:
            raise ValueError(f"Exceeds max {self.MAX_CONTACTS} contacts")
        self.contacts.extend(new_contacts)

    def __len__(self) -> int:
        return len(self.contacts)
```

### Slots for Memory Efficiency
```python
@dataclass(slots=True)
class LightweightContact:
    """Memory-efficient contact using __slots__."""
    name: str
    phone: str
    email: str | None = None
```

---

## 5. ASYNCIO & CONCURRENCY

### Async/Await Patterns
```python
import asyncio
from typing import AsyncIterator

# Async context manager
class WhatsAppSession:
    async def __aenter__(self) -> "WhatsAppSession":
        await self.connect()
        return self

    async def __aexit__(self, *args) -> None:
        await self.disconnect()

# Using async context manager
async def run_campaign(session: WhatsAppSession) -> None:
    async with session:
        await session.send_messages(messages)

# Async iterator
async def watch_messages(
    session: WhatsAppSession
) -> AsyncIterator[Message]:
    while True:
        msg = await session.get_next_message()
        if msg is None:
            await asyncio.sleep(0.1)
            continue
        yield msg

# Consuming async iterator
async def process_messages() -> None:
    async for message in watch_messages(session):
        await process(message)

# Gather for parallel execution
async def send_batch(messages: list[Message]) -> list[Result]:
    tasks = [send_message(msg) for msg in messages]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Handle exceptions
    successes = [r for r in results if isinstance(r, Result)]
    failures = [r for r in results if isinstance(r, Exception)]

    return successes
```

### Threading for Blocking Operations
```python
import concurrent.futures
from threading import Lock

class RateLimitedSender:
    def __init__(self, delay: float = 1.0) -> None:
        self.delay = delay
        self._lock = Lock()
        self._last_send = 0.0

    def send(self, message: str) -> None:
        with self._lock:
            now = time.time()
            elapsed = now - self._last_send
            if elapsed < self.delay:
                time.sleep(self.delay - elapsed)
            self._do_send(message)
            self._last_send = time.time()

# Thread pool for CPU-bound work
def process_large_file(path: str) -> ProcessedResult:
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        chunks = split_file(path, 4)
        futures = [executor.submit(process_chunk, chunk) for chunk in chunks]
        results = [f.result() for f in futures]
    return merge_results(results)
```

---

## 6. LOGGING & OBSERVABILITY

### Structured Logging
```python
import logging
from logging import LogRecord
import json

class JSONFormatter(logging.Formatter):
    """Format logs as JSON for structured logging."""

    def format(self, record: LogRecord) -> str:
        log_data = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        # Add extra fields
        if hasattr(record, "campaign_id"):
            log_data["campaign_id"] = record.campaign_id
        if hasattr(record, "contact_count"):
            log_data["contact_count"] = record.contact_count

        return json.dumps(log_data)

# Logger setup
logger = logging.getLogger("whatsapp_blast")
logger.setLevel(logging.DEBUG)

# Console handler with JSON format
console_handler = logging.StreamHandler()
console_handler.setFormatter(JSONFormatter())
logger.addHandler(console_handler)

# Usage with extra context
logger.info(
    "Campaign started",
    extra={"campaign_id": campaign.id, "contact_count": len(contacts)}
)
```

---

## 7. DECORATORS & METAPROGRAMMING

### Function Decorators
```python
import functools
import time
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec("P")
R = TypeVar("R")

def retry(
    max_attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    """Retry decorator with exponential backoff."""
    def decorator(func: Callable[P, R]) -> Callable[P, R]:
        @functools.wraps(func)
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            current_delay = delay
            last_exception: Exception | None = None

            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        time.sleep(current_delay)
                        current_delay *= backoff

            raise last_exception from None
        return wrapper
    return decorator

# Usage
@retry(max_attempts=3, delay=2.0, backoff=2.0)
def send_whatsapp_message(phone: str, message: str) -> bool:
    ...

# Decorator with arguments
@functools.lru_cache(maxsize=128)
def load_template(template_id: str) -> Template:
    """Cache expensive template loading."""
    return database.get_template(template_id)
```

### Class Decorators
```python
def singleton(cls: type[T]) -> type[T]:
    """Ensure only one instance exists."""
    instances: dict[type, T] = {}
    @functools.wraps(cls)
    def get_instance(*args, **kwargs) -> T:
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class WhatsAppSession:
    ...

# dataclass-based singleton
@dataclass
class AppConfig:
    _instance: ClassVar["AppConfig | None"] = None

    @classmethod
    def get_instance(cls) -> "AppConfig":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
```

---

## 8. ITERTOOLS & FUNCTIONAL PATTERNS

### Powerful Itertools Usage
```python
from itertools import batched, pairwise, groupby, islice

# Batch processing
def process_in_batches(items: list[T], batch_size: int) -> Iterator[list[T]]:
    for batch in batched(items, batch_size):
        yield list(batch)

# Pairwise for sliding windows
def validate_sequence(items: list[int]) -> bool:
    for prev, curr in pairwise(items):
        if curr <= prev:
            return False
    return True

# Takewhile/Dropwhile
def parse_log_lines(lines: Iterator[str]) -> Iterator[LogEntry]:
    lines = dropwhile(lambda l: not l.startswith("START"), lines)
    lines = takewhile(lambda l: not l.startswith("END"), lines)
    return map(parse_line, lines)

# Infinite iterator with cycle
def round_robin(*iterables: Iterable[T]) -> Iterator[T]:
    """Cycle through iterables round-robin style."""
    pending = len(iterables)
    nexts = itertools.cycle(iter(it).__next__ for it in iterables)
    while pending:
        try:
            for next_func in nexts:
                yield next_func()
        except StopIteration:
            pending -= 1
            nexts = itertools.cycle(
                itertools.islice(nexts, pending)
            )
```

---

## 9. PERFORMANCE PATTERNS

### Caching Strategies
```python
import functools
from typing import Callable

# LRU Cache with size limit
@functools.lru_cache(maxsize=1024)
def get_contact(phone: str) -> Contact | None:
    """Cache frequent lookups."""
    return database.find_contact_by_phone(phone)

# Cache with TTL (custom implementation)
import time
from dataclasses import dataclass, field

@dataclass
class CachedValue(Generic[T]):
    value: T
    expires_at: float

class TTLCache:
    def __init__(self, ttl_seconds: float = 300) -> None:
        self._cache: dict[str, CachedValue] = {}
        self._ttl = ttl_seconds

    def get(self, key: str) -> Any | None:
        if key in self._cache:
            cached = self._cache[key]
            if time.time() < cached.expires_at:
                return cached.value
            del self._cache[key]
        return None

    def set(self, key: str, value: Any) -> None:
        self._cache[key] = CachedValue(value, time.time() + self._ttl)
```

### Lazy Evaluation
```python
from functools import cached_property

class Campaign:
    def __init__(self, id: str) -> None:
        self.id = id
        self._contacts: list[Contact] | None = None

    @cached_property
    def contacts(self) -> list[Contact]:
        """Lazy load contacts - only when accessed."""
        return database.get_campaign_contacts(self.id)

    @cached_property
    def statistics(self) -> CampaignStats:
        """Expensive computation - cached after first access."""
        return self._compute_statistics()
```

---

## 10. TESTING WITH PYTEST

### Pytest Patterns
```python
import pytest
from hypothesis import given, strategies as st

# Parametrized tests
@pytest.mark.parametrize("phone,expected", [
    ("081234567890", True),
    ("+6281234567890", True),
    ("123456", False),
    ("", False),
])
def test_contact_validation(phone: str, expected: bool) -> None:
    contact = Contact(phone=phone, name="Test")
    assert contact.is_valid() == expected

# Fixtures with cleanup
@pytest.fixture
def temp_campaign(tmp_path: pytest.TempPathFactory) -> Campaign:
    campaign = Campaign(id="test-123", name="Test Campaign")
    yield campaign
    # Cleanup
    campaign.stop()

# Async tests
@pytest.mark.asyncio
async def test_whatsapp_session() -> None:
    async with WhatsAppSession() as session:
        result = await session.send_message("test", "Hello")
        assert result.success

# Property-based testing
@given(st.text(min_size=1, max_size=100))
def test_phone_normalization(phone: str) -> None:
    normalized = normalize_phone(phone)
    assert normalized.startswith(("0", "+"))
    assert len(normalized) >= 10

# Mocking
from unittest.mock import Mock, patch, AsyncMock

def test_send_message() -> None:
    with patch("whatsapp.Session") as mock_session:
        mock_instance = mock_session.return_value
        mock_instance.send.return_value = True

        result = send_message("081234567890", "Hello")
        assert result is True
        mock_instance.send.assert_called_once()
```

---

## 11. PROJECT STRUCTURE

### Clean Architecture Structure
```
project/
├── domain/              # Core business logic (no external deps)
│   ├── entities.py      # Domain entities
│   ├── value_objects.py # Value objects
│   ├── events.py        # Domain events
│   └── exceptions.py    # Domain exceptions
│
├── application/         # Use cases / services
│   ├── interfaces.py    # Abstract interfaces (ports)
│   ├── services.py      # Service implementations
│   └── dtos.py          # Data Transfer Objects
│
├── infrastructure/      # External implementations
│   ├── persistence/     # Database implementations
│   ├── external/        # External API clients
│   └── messaging/       # Message queue implementations
│
├── presentation/        # UI / API layer
│   ├── api/             # REST/GraphQL endpoints
│   ├── cli/             # CLI commands
│   └── gui/             # GUI applications
│
├── tests/               # Test packages
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── pyproject.toml       # Modern Python project config
├── .env.example         # Environment template
└── README.md
```

---

## 12. PYPROJECT.TOML MODERN STANDARDS

```toml
[project]
name = "whatsapp-blast"
version = "3.2.0"
description = "Bulk WhatsApp messaging tool"
requires-python = ">=3.10"
dependencies = [
    "customtkinter>=5.2.0",
    "selenium>=4.15.0",
    "pandas>=2.1.0",
    "openpyxl>=3.1.2",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov>=4.1.0",
    "ruff>=0.1.0",
    "mypy>=1.7.0",
]
prod = [
    "pywin32>=306",
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_functions = ["test_*"]
addopts = "-v --tb=short"

[tool.ruff]
line-length = 100
target-version = "py310"
select = ["E", "F", "I", "N", "W", "UP", "B", "C4"]

[tool.mypy]
python_version = "3.10"
strict = true
warn_return_any = true
warn_unused_ignores = true
```

---

**Invoke:** `/python-pro` | **Priority:** HIGH | **Version:** 1.0
