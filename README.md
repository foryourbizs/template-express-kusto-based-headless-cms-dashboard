This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GroupedTable with React Admin CRUD Integration

This project includes a powerful `GroupedTable` component that integrates with React Admin's permission system to provide secure, user-friendly CRUD operations.

### 🔐 Permission-Based CRUD Actions

The GroupedTable component automatically checks user permissions and displays only authorized actions:

```tsx
<GroupedTable
  crudActions={{
    enableShow: true,    // View permission
    enableEdit: true,    // Edit permission  
    enableDelete: true,  // Delete permission
    enableCreate: true,  // Create permission
    resource: 'privates/users', // React Admin resource
    customActions: [     // Custom actions with conditional display
      {
        label: 'Terminate Session',
        icon: <LogoutIcon />,
        onClick: (item) => handleLogout(item),
        show: (item) => item.isActive
      }
    ]
  }}
/>
```

### 🎯 Automatic Permission Checking

Using React Admin's `useCanAccess` hook, the component automatically verifies:

- **canShow**: View item permission
- **canEdit**: Edit item permission  
- **canDelete**: Delete item permission
- **canCreate**: Create new item permission

Buttons for unauthorized actions are automatically hidden.

### 🚀 Unified Navigation

React Admin's `useRedirect` hook provides consistent page navigation:

```tsx
// Automatic navigation to appropriate pages
redirect('edit', resource, item.id);   // Edit page
redirect('show', resource, item.id);   // Detail page  
redirect('create', resource);          // Create page
```

### 📊 Example Implementations

1. **User Logs** (`UserLogsGroupedList`):
   - Groups audit logs by user
   - Shows only view and delete actions
   - Uses React Admin List context

2. **User Management** (`UserList`):
   - Groups users by status
   - Full CRUD operations (create, view, edit, delete)
   - Status-based grouping

3. **User Sessions** (`UserSessionList`):
   - Groups sessions by status
   - Custom "Terminate Session" action
   - Session management functionality

### 🔧 Key Features

- **Automatic Permission Integration**: Seamless React Admin permissions
- **Flexible Action System**: Support for both standard CRUD and custom actions
- **Consistent UI/UX**: Unified navigation and interaction patterns
- **Type Safety**: Full TypeScript support with proper interfaces
- **Performance Optimized**: Efficient rendering with React hooks optimization
