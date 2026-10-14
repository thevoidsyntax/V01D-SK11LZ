---
name: supabase
version: "1.0.0"
description: "Supabase patterns, database design, auth, storage, and real-time subscriptions."
when_to_use: "When using Supabase as backend-as-a-service, implementing auth, or using real-time features."
priority: medium
phase: production
category: [database, backend]
tech_stack:
  databases: [postgresql]
  services: [supabase]
scale: [small, medium, large]
auto_invoke:
  enabled: true
  conditions:
    - pattern: ["supabase", "@supabase"]
      reason: "Supabase usage detected"
    - has_file: ["supabase/**", "**/supabase.js", "**/supabase.ts"]
      reason: "Supabase project detected"
capabilities:
  - auth
  - realtime
  - storage
  - database-functions
author: TheVoidSyntax
---

# SUPABASE v1.0 🔥

**Supabase backend-as-a-service patterns, auth, real-time, and database functions**

---

## Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE CLI                                                │
├─────────────────────────────────────────────────────────────┤
│  supabase init              → Initialize project             │
│  supabase start           → Start local dev                 │
│  supabase db push         → Push migrations                 │
│  supabase db reset        → Reset local database           │
│  supabase functions serve → Test Edge Functions locally     │
│  supabase functions deploy → Deploy Edge Functions          │
└─────────────────────────────────────────────────────────────┘
```

---

## Client Setup

### TypeScript/JS

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side client (with service role)
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
);
```

---

## Database Design

### Schema Example: Blog

```sql
-- Users (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#3b82f6'
);

-- Post Categories (many-to-many)
CREATE TABLE public.post_categories (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Comments
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view, only owner can update
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Posts: Public can view published, authors can manage their own
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts FOR SELECT
  USING (
    published = true 
    OR auth.uid() = author_id
  );

CREATE POLICY "Authors can insert their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own posts"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments: Authenticated can create, view their own
CREATE POLICY "Anyone can view comments"
  ON public.comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = author_id);
```

---

## Authentication

### Sign Up / Sign In

```typescript
// Sign up with email
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    data: {
      username: 'johndoe',
      full_name: 'John Doe',
    },
  },
});

// Sign in with email
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign in with OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github', 'discord', etc.
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});

// Sign out
const { error } = await supabase.auth.signOut();
```

### Auth State

```typescript
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### Auth Middleware (Edge Functions)

```typescript
import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('sb-access-token')?.value;

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Verify token with Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Add user to headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.id);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
```

---

## Real-time

### Subscribe to Changes

```typescript
import { useEffect, useState } from 'react';

export function useRealtimePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Initial fetch
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
      });

    // Subscribe to changes
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: 'published=eq.true',
        },
        (payload) => {
          setPosts((prev) => [payload.new as Post, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          setPosts((prev) =>
            prev.map((post) =>
              post.id === payload.new.id ? (payload.new as Post) : post
            )
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          setPosts((prev) =>
            prev.filter((post) => post.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return posts;
}
```

### Presence (Online Users)

```typescript
// Track online users
const channel = supabase.channel('room-1', {
  config: {
    presence: {
      key: 'user-id',
    },
  },
});

channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    console.log('Online users:', Object.keys(state).length);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: 'user-123',
        username: 'John',
        online_at: new Date().toISOString(),
      });
    }
  });
```

---

## Storage

### Upload Files

```typescript
// Upload avatar
const avatarFile = event.target.files?.[0];
if (avatarFile) {
  const fileExt = avatarFile.name.split('.').pop();
  const fileName = `${user.id}-${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatarFile, {
      upsert: true,
    });

  if (error) {
    console.error('Upload failed:', error);
    return;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
}
```

### Download Files

```typescript
// Download with auth
const { data, error } = await supabase.storage
  .from('private-files')
  .download('private/document.pdf');
```

### Storage Policies

```sql
-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Database Functions

### Edge Functions

```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user email
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      req.headers.get('Authorization')!.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Send email (using your preferred provider)
    // Example with Resend:
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@example.com',
        to: user.email,
        subject,
        html,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
```

### Trigger Functions

```sql
-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::text, 8)),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

## Common Patterns

### Fetch with Join

```typescript
// Get posts with author info
const { data, error } = await supabase
  .from('posts')
  .select(`
    *,
    author:profiles!author_id (
      id,
      username,
      full_name,
      avatar_url
    ),
    categories:post_categories (
      category:categories (
        id,
        name,
        slug
      )
    )
  `)
  .eq('published', true)
  .order('created_at', { ascending: false });
```

### Optimistic Updates

```typescript
const updatePost = async (id: string, updates: Partial<Post>) => {
  // Optimistic update
  setPosts((prev) =>
    prev.map((post) =>
      post.id === id ? { ...post, ...updates } : post
    )
  );

  const { error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id);

  if (error) {
    // Rollback on error
    setPosts((prev) => prev);
    console.error('Update failed:', error);
  }
};
```

---

## Related Skills

| Skill | Use Case |
|-------|----------|
| `/postgresql-pro` | PostgreSQL patterns |
| `/database` | Database design |
| `/auth-flows` | Authentication patterns |

---

*Build backend in minutes, not months!*
