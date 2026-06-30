# Build a typed generic data fetcher

> Combines generics, async/await, error handling, and good TypeScript API design.

## Problem

Build a `createFetcher` factory that returns a typed `fetch` wrapper. It should:
- Accept a base URL
- Return a `get<T>(path, params?)` method typed to return `T`
- Handle non-OK responses by throwing an `ApiError` with status + message
- Support query string params

## Solution

```ts
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetcherOptions {
  baseUrl: string;
  headers?: Record<string, string>;
}

function createFetcher({ baseUrl, headers = {} }: FetcherOptions) {
  async function get<T>(
    path: string,
    params?: Record<string, string | number>,
  ): Promise<T> {
    const url = new URL(path, baseUrl);

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        url.searchParams.set(k, String(v));
      });
    }

    const res = await fetch(url.toString(), { headers });

    if (!res.ok) {
      const message = await res.text().catch(() => res.statusText);
      throw new ApiError(res.status, message);
    }

    return res.json() as Promise<T>;
  }

  return { get };
}
```

## Usage

```ts
interface User     { id: number; name: string; email: string; }
interface Post     { id: number; title: string; body: string; }
interface PagedResult<T> { items: T[]; total: number; page: number; }

const api = createFetcher({
  baseUrl: 'https://api.example.com',
  headers:  { Authorization: 'Bearer token' },
});

const user  = await api.get<User>('/users/1');           // typed as User
const posts = await api.get<Post[]>('/posts');            // Post[]
const page  = await api.get<PagedResult<Post>>('/posts', { page: 2, limit: 10 });

// Error handling
try {
  const data = await api.get<User>('/users/999');
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status, err.message); // 404, "Not Found"
  }
}
```

## Extension — adding POST

```ts
function createFetcher({ baseUrl, headers = {} }: FetcherOptions) {
  // ...get...

  async function post<TBody, TResponse>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const message = await res.text().catch(() => res.statusText);
      throw new ApiError(res.status, message);
    }

    return res.json() as Promise<TResponse>;
  }

  return { get, post };
}

// Usage
const newUser = await api.post<CreateUserDto, User>('/users', {
  name: 'Ana',
  email: 'ana@example.com',
});
```

## Senior follow-ups

- **"How would you add request cancellation?"** Accept an optional `AbortSignal` parameter and pass it to `fetch({ signal })`. The caller controls the `AbortController`.
- **"How would you add response caching?"** Wrap `get` to check a `Map<string, T>` keyed by URL before fetching. Add a `cache: 'no-store' | 'default'` option.
- **"Why `as Promise<T>` on `res.json()`?"** `res.json()` returns `Promise<any>`. This is one of the few places where a cast is appropriate — you're explicitly committing to the shape. The alternative is runtime validation with a library like `zod`.
