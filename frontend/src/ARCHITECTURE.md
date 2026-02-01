# Frontend Architecture

## Overview

This is a professional Monaco code editor application with authentication, routing, and language/theme switching capabilities.

## Project Structure

```
frontend/src/
├── pages/
│   └── Auth/
│       ├── LoginPage.jsx          # Login page with glassmorphism design
│       ├── SignupPage.jsx         # Signup page with glassmorphism design
│       └── AuthStyles.css          # Shared authentication styles
├── components/
│   ├── Navbar.jsx                 # Top navigation with language/theme selectors
│   ├── Sidebar.jsx                # File browser sidebar
│   └── CodeEditor.jsx             # Monaco editor component
├── context/
│   └── AuthContext.jsx            # Global authentication state management
├── services/
│   └── authService.js              # Authentication API service layer
└── App.jsx                         # Main app with routing

```

## Key Features

### 1. Authentication System

- **AuthContext** (`context/AuthContext.jsx`): Manages global auth state
- **AuthService** (`services/authService.js`): Handles API calls (currently mock, easy to replace)
- **Protected Routes**: Editor route is protected and requires authentication

### 2. Pages

- **LoginPage**: Glassmorphism design with gradient background
- **SignupPage**: Similar design with user registration
- **Editor Page**: Monaco editor with language/theme switching

### 3. Components

- **Navbar**: Language selector, theme selector, user info, and logout button
- **Sidebar**: File browser (ready for future enhancement)
- **CodeEditor**: Monaco editor with dynamic language and theme support

## Backend Integration

To connect to a real backend:

1. Update `services/authService.js`:
   - Uncomment the actual API calls
   - Remove mock authentication code
   - Update `API_BASE_URL` in the service file

2. Create a `.env` file in `frontend/`:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. The service layer is designed to be easily swapped:
   - Same function signatures
   - Same return types
   - Minimal changes needed

## Routing

- `/` → Redirects to `/login`
- `/login` → Login page (public)
- `/signup` → Signup page (public)
- `/editor` → Editor page (protected, requires auth)
- `*` → Redirects to `/login`

## State Management

- **Authentication**: Managed by AuthContext (global)
- **Language/Theme**: Managed locally in EditorLayout component
- **Editor State**: Managed locally in CodeEditor component

## Styling

- Uses TailwindCSS for utility classes
- Custom glassmorphism styles in `AuthStyles.css`
- Responsive design for mobile devices

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

- File management system
- Code sharing features
- Collaborative editing
- Cloud storage integration
- User settings persistence
