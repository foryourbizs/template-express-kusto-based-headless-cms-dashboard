# Admin Dashboard - AI Coding Assistant Instructions

## Project Overview

This is a Next.js 15 + React Admin 5 dashboard for managing a headless CMS backend. The app uses **App Router** with client-side rendering ("use client") and integrates with a JSON:API-compliant backend.

**Tech Stack**: Next.js 15, React 19, React Admin 5, Material-UI, TypeScript, Korean i18n

## Architecture & Key Patterns

### 1. Client-Side React Admin in Next.js App Router

**Critical**: All React Admin components require `"use client"` directive.

- Main app: `src/components/react-admin/AdminApp.tsx` - wrapped in `<BrowserRouter>` for client-side routing
- Entry point: `src/app/page.tsx` imports `AdminApp` 
- Layout: Custom layout at `src/components/react-admin/components/Layout.tsx` (not React Admin's default)

### 2. Data Layer Architecture

**JSON:API Backend Integration** (`src/components/react-admin/lib/`):

- `client.ts` - Core requester with JWT auth, error mapping, and JSON:API parsing
- `dataProvider.ts` - Wraps client with request caching (100ms TTL) to prevent duplicate calls
- `authProvider.ts` - JWT token management with automatic refresh, 30s check caching

**Key Conventions**:
- All API endpoints use JSON:API format: `{ data: { id, attributes, relationships }, included }`
- Backend URL: `process.env.ADMIN_SERVER_URL` or `NEXT_PUBLIC_ADMIN_SERVER_URL`
- JWT tokens stored in localStorage: `accessToken`, `refreshToken`, `accessTokenExpiresAt`, `refreshTokenExpiresAt`
- Request deduplication: Same requests within 100ms return cached promise

### 3. Authentication & Session Management

**Token Lifecycle** (`src/components/react-admin/lib/authProvider.ts`):

```typescript
// Login stores tokens + expiry times
login() // -> localStorage: user, accessToken, refreshToken, *ExpiresAt

// checkAuth cached for 30s to prevent excessive server calls
checkAuth({}) // -> checks localStorage first, then server validation

// Automatic logout on 401, clears all localStorage
logout() // -> anti-duplicate flag prevents concurrent logouts
```

**Initial Auth Check Pattern** (`AdminApp.tsx`):

To prevent flash of unauthenticated content, the app performs auth check before rendering:

```typescript
const AdminApp = () => {
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        await authProvider.checkAuth({});
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkInitialAuth();
  }, []);

  if (!authChecked) {
    return <AuthCheckLoader />; // Show spinner, not login page
  }
  
  return <Admin requireAuth ...>
};
```

**Monitoring** (`src/components/react-admin/hooks/useAuthMonitor.ts`):
- Checks token expiry every 60s (local check only)
- Shows `ReauthModal` when refreshToken expires
- Global `auth-error` event listener triggers reauth modal

### 4. Custom Components Pattern

**GroupedTable Component** (`src/components/react-admin/components/common/GroupedTable.tsx`):

This is the **primary data display pattern** - replaces React Admin's default `<Datagrid>` for grouped/categorized data.

Key features:
- **Permission-based CRUD**: Uses `useCanAccess` to auto-hide unauthorized actions
- **Two pagination modes**: `mode: 'group'` (per-group) vs `mode: 'global'` (all items)
- **Integrated actions**: View/Edit/Delete buttons with React Admin navigation (`useRedirect`)

Example usage (see `UserLogsGroupedList.tsx`):
```tsx
<MultiGroupTable
  groupedData={groupedLogs}
  columns={columns}
  crudActions={{
    enableShow: true,
    enableDelete: true,
    resource: 'privates/users/audits'
  }}
  pagination={{ enabled: true, mode: 'global', pageSize: 20 }}
/>
```

### 5. Resource Organization

**Resource Naming** (`AdminApp.tsx`):
- Backend resources use nested paths: `privates/users`, `privates/users/audits`, `privates/files`
- Menu grouping via `options.menuGroup` and `menuGroupLabel`
- Korean labels: `options.label`

**Guesser Pattern** (`src/components/react-admin/components/guesser/`):
- Custom List/Edit/Create/Show components for each resource
- Most use custom layouts instead of React Admin defaults
- Common pattern: `<List>` → custom component → `<GroupedTable>` or `<Datagrid>`

## Development Workflows

### Running the App

```powershell
npm run dev        # Development with Turbopack (default port 3000)
npm run build      # Production build with Turbopack
npm run start      # Start production server
```

### Environment Configuration

Required in `.env.local` (see `env.template`):
```
ADMIN_SERVER_URL=https://headless-cms-v1.foryourbizs.com
NEXT_PUBLIC_ADMIN_SERVER_URL=https://headless-cms-v1.foryourbizs.com
```

### Testing Authentication

Test login credentials hardcoded in `authProvider.ts` (disabled by default):
```typescript
// username: 'test', password: '1234' (set flag to true to enable)
```

## Project-Specific Conventions

### 1. TypeScript Configuration

`tsconfig.json` has **strict mode disabled** for faster iteration:
```json
{
  "strict": false,
  "noUnusedLocals": false,
  "noImplicitAny": false
}
```

### 2. Korean Localization

Custom Korean messages in `AdminApp.tsx`:
```typescript
const customKoreanMessages = {
  ...koreanMessages,
  ra: { ...koreanMessages.ra, action: { unselect: '선택 해제' } }
};
```

### 3. Error Handling Pattern

Backend error codes mapped to Korean messages in `client.ts`:
```typescript
case 'NOT_FOUND': return '요청한 데이터를 찾을 수 없습니다.';
case 'VALIDATION_ERROR': return '입력한 데이터가 올바르지 않습니다.';
```

### 4. Theme Customization

Gray-themed Material-UI config at `src/components/react-admin/config/theme.ts`:
- Primary: `#AD8992FF` (grayish-pink)
- All components use subtle shadows and rounded corners (6px)

## Critical Files Reference

| File | Purpose |
|------|---------|
| `src/components/react-admin/AdminApp.tsx` | Main app config, resource definitions |
| `src/components/react-admin/lib/client.ts` | HTTP client, JSON:API parsing, error mapping |
| `src/components/react-admin/lib/dataProvider.ts` | React Admin data provider with caching |
| `src/components/react-admin/lib/authProvider.ts` | JWT auth, token refresh, session management |
| `src/components/react-admin/components/common/GroupedTable.tsx` | Primary table component for grouped data |
| `src/components/react-admin/hooks/useAuthMonitor.ts` | Auth expiry monitoring, reauth modal logic |

## Common Pitfalls

1. **Forgetting `"use client"`** - All React Admin components need this in App Router
2. **Direct token access** - Always use `authProvider` methods, not localStorage directly
3. **Duplicate requests** - DataProvider already caches; avoid manual deduplication
4. **Permission checks** - Use `useCanAccess` hook instead of manual permission logic
5. **React Strict Mode disabled** - `next.config.ts` sets `reactStrictMode: false` to prevent double-mounting issues

## When Adding New Resources

1. Add `<Resource>` to `AdminApp.tsx` with Korean labels and menu grouping
2. Create custom List/Edit/Create components in `src/components/react-admin/components/guesser/`
3. Use `GroupedTable` for lists that need grouping or advanced CRUD actions
4. Implement `useCanAccess` checks for permission-based UI
5. Follow JSON:API conventions for data structure (id, attributes, relationships)
