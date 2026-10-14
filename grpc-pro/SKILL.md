---
name: grpc-pro
description: "gRPC and Protocol Buffers patterns including streaming, error handling, and microservices communication"
version: "1.0.0"
category: [backend]
priority: high
phase: any
auto_invoke:
  enabled: true
  conditions:
    - command: ["/grpc-pro", "/grpc"]
      reason: "gRPC development"
    - phrase: ["grpc", "protocol buffers", "protobuf", "grpc-web"]
      reason: "gRPC context detected"
tech_stack:
  languages: [go, typescript, python, java]
scale: [medium, large, enterprise]
integrates_with: [api-design, microservices, observability]
capabilities: [implementation]
quality:
  rules_count: 15
  examples_count: 8
  stability: stable
source:
  origin: local
author: thevoidsyntax
---

# gRPC Pro

> gRPC and Protocol Buffers patterns for high-performance microservices communication.

## Protocol Buffers

### Proto Definition

```protobuf
syntax = "proto3";

package user;

option go_package = "github.com/example/proto/user/v1";

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
  rpc StreamUsers(StreamUsersRequest) returns (stream User);
}

message User {
  string id = 1;
  string email = 2;
  string name = 3;
  int64 created_at = 4;
  repeated string roles = 5;
}

message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}
```

### Common Types

```protobuf
// google/protobuf/timestamp.proto
import "google/protobuf/timestamp.proto";

// Empty request/response
message Empty {}

// Paginated response
message ListResponse {
  repeated User items = 1;
  string next_cursor = 2;
  int32 total_count = 3;
}
```

## Go Implementation

### Server

```go
package server

import (
    "context"
    "log"
    
    "github.com/example/proto/user/v1"
    "google.golang.org/grpc"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"
)

type UserServer struct {
    v1.UnimplementedUserServiceServer
    repo UserRepository
}

func NewUserServer(repo UserRepository) *UserServer {
    return &UserServer{repo: repo}
}

func (s *UserServer) GetUser(ctx context.Context, req *v1.GetUserRequest) (*v1.GetUserResponse, error) {
    if req.Id == "" {
        return nil, status.Errorf(codes.InvalidArgument, "id is required")
    }
    
    user, err := s.repo.FindByID(ctx, req.Id)
    if err != nil {
        if err == ErrNotFound {
            return nil, status.Errorf(codes.NotFound, "user not found")
        }
        return nil, status.Errorf(codes.Internal, "failed to get user")
    }
    
    return &v1.GetUserResponse{User: toProtoUser(user)}, nil
}

func (s *UserServer) StreamUsers(req *v1.StreamUsersRequest, stream v1.UserService_StreamUsersServer) error {
    users, err := s.repo.FindAll(stream.Context())
    if err != nil {
        return status.Errorf(codes.Internal, "failed to stream users")
    }
    
    for _, user := range users {
        if err := stream.Send(toProtoUser(user)); err != nil {
            return err
        }
    }
    
    return nil
}

func toProtoUser(u *User) *v1.User {
    return &v1.User{
        Id:        u.ID,
        Email:     u.Email,
        Name:      u.Name,
        CreatedAt: u.CreatedAt.Unix(),
        Roles:     u.Roles,
    }
}
```

### Client

```go
package client

import (
    "context"
    "log"
    
    "github.com/example/proto/user/v1"
    "google.golang.org/grpc"
    "google.golang.org/grpc/credentials/insecure"
)

func NewUserClient(addr string) (v1.UserServiceClient, *grpc.ClientConn, error) {
    conn, err := grpc.Dial(addr,
        grpc.WithTransportCredentials(insecure.NewCredentials()),
        grpc.WithUnaryInterceptor(loggingInterceptor),
        grpc.WithStreamInterceptor(streamLoggingInterceptor),
    )
    if err != nil {
        return nil, nil, err
    }
    
    return v1.NewUserServiceClient(conn), conn, nil
}

func GetUser(ctx context.Context, client v1.UserServiceClient, id string) (*User, error) {
    resp, err := client.GetUser(ctx, &v1.GetUserRequest{Id: id})
    if err != nil {
        return nil, err
    }
    return fromProtoUser(resp.User), nil
}
```

## Interceptors

### Unary Interceptor

```go
func loggingInterceptor(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker) error {
    start := time.Now()
    err := invoker(ctx, method, req, reply, cc)
    log.Printf("gRPC call %s completed in %v, error: %v", method, time.Since(start), err)
    return err
}
```

### Server Interceptor

```go
func authInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    // Extract metadata
    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return nil, status.Errorf(codes.Unauthenticated, "missing metadata")
    }
    
    // Validate token
    token := md.Get("authorization")
    if len(token) == 0 {
        return nil, status.Errorf(codes.Unauthenticated, "missing token")
    }
    
    // Continue handler
    return handler(ctx, req)
}

func recoveryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    defer func() {
        if r := recover(); r != nil {
            log.Printf("panic recovered: %v", r)
        }
    }()
    return handler(ctx, req)
}
```

## Streaming Patterns

### Server Streaming

```protobuf
service AnalyticsService {
  rpc StreamEvents(StreamEventsRequest) returns (stream Event);
}
```

```go
func (s *AnalyticsServer) StreamEvents(req *v1.StreamEventsRequest, stream v1.AnalyticsService_StreamEventsServer) error {
    events, err := s.analytics.Subscribe(req.UserId)
    if err != nil {
        return err
    }
    defer events.Close()
    
    for {
        select {
        case event := <-events.Chan():
            if err := stream.Send(toProtoEvent(event)); err != nil {
                return err
            }
        case <-stream.Context().Done():
            return nil
        }
    }
}
```

### Bidirectional Streaming

```protobuf
service ChatService {
  rpc StreamMessages(stream ChatMessage) returns (stream ChatMessage);
}
```

```go
func (s *ChatServer) StreamMessages(stream v1.ChatService_StreamMessagesServer) error {
    for {
        msg, err := stream.Recv()
        if err == io.EOF {
            return nil
        }
        if err != nil {
            return err
        }
        
        // Process message
        processed := processMessage(msg)
        
        // Broadcast to stream
        if err := stream.Send(processed); err != nil {
            return err
        }
    }
}
```

## Error Handling

### gRPC Status Codes

| Code | Use Case |
|------|----------|
| `OK` | Success |
| `InvalidArgument` | Bad input |
| `NotFound` | Resource not found |
| `AlreadyExists` | Duplicate resource |
| `PermissionDenied` | Auth failure |
| `Unauthenticated` | No valid auth |
| `ResourceExhausted` | Rate limit |
| `Internal` | Server error |

### Error Wrapping

```go
import "google.golang.org/grpc/status"

// Wrap error
return nil, status.Errorf(codes.NotFound, "user %s not found", id)

// Check error
if st, ok := status.FromError(err); ok {
    switch st.Code() {
    case codes.NotFound:
        // Handle not found
    case codes.Unauthenticated:
        // Handle auth error
    default:
        // Handle other errors
    }
}
```

## Health Checks

```protobuf
service Health {
  rpc Check(HealthCheckRequest) returns (HealthCheckResponse);
  rpc Watch(HealthCheckRequest) returns (stream HealthCheckResponse);
}
```

```go
func (s *Server) Check(ctx context.Context, req *grpc_health_v1.HealthCheckRequest) (*grpc_health_v1.HealthCheckResponse, error) {
    return &grpc_health_v1.HealthCheckResponse{
        Status: grpc_health_v1.HealthCheckResponse_SERVING,
    }, nil
}
```

## Best Practices

### 1. Proto Design

```protobuf
// ✅ Good: Clear naming
message CreateUserRequest {
  string email = 1;
  string name = 2;
}

// ❌ Bad: Hungarian notation
message CreateUserReq {
  string str_email = 1;
}
```

### 2. Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Package | `domain.service` | `user.v1` |
| Message | PascalCase | `GetUserRequest` |
| Field | snake_case | `user_id` |
| RPC | PascalCase | `GetUser` |
| Enum | PascalCase | `UserStatus` |
| Enum Value | SCREAMING_SNAKE | `USER_STATUS_ACTIVE` |

### 3. Migration Strategy

```protobuf
// Add new field (never remove old ones)
message User {
  string id = 1;
  string email = 2;
  string name = 3;
  string nickname = 4;  // NEW - optional
}

// Never do this:
// message User {
//   string id = 1;
//   string email = 2;
//   // REMOVED - BREAKING CHANGE
// }
```

## Load Balancing

### Client-Side

```go
conn, err := grpc.Dial(
    "dns:///userservice:8080",
    grpc.WithBalancerName("round_robin"),
)
```

### Server-Side

```go
import "google.golang.org/grpc/balancer/roundrobin"

conn, err := grpc.Dial(
    "consul:///user-service",
    grpc.WithBalancerName(roundrobin.Name),
)
```

## Timeout & Retry

```go
conn, err := grpc.Dial(target,
    grpc.WithUnaryInterceptor(grpc_retry.UnaryClientInterceptor()),
    grpc.WithStreamInterceptor(grpc_retry.StreamClientInterceptor()),
)

opts := []grpc_retry.CallOption{
    grpc_retry.WithMax(3),
    grpc_retry.WithBackoff(grpc_retry.BackoffExponentialWithJitter(100*time.Millisecond, 0.1)),
}
```

---

**Invoke:** /grpc-pro | **Priority:** HIGH | **Version:** 1.0.0
