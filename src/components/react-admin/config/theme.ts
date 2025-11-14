import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#AD8992FF', // Gray-500
      light: '#9ca3af', // Gray-400
      dark: '#4b5563', // Gray-600
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#374151', // Gray-700
      light: '#6b7280', // Gray-500
      dark: '#1f2937', // Gray-800
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9fafb', // Gray-50
      paper: '#ffffff',
    },
    text: {
      primary: '#111827', // Gray-900
      secondary: '#4A505CFF', // Gray-500
    },
    divider: '#e5e7eb', // Gray-200
    action: {
      hover: '#f3f4f6', // Gray-100
      selected: '#e5e7eb', // Gray-200
      disabled: '#d1d5db', // Gray-300
      disabledBackground: '#f3f4f6', // Gray-100
    },
    error: {
      main: '#ef4444', // Red-500
      light: '#f87171', // Red-400
      dark: '#dc2626', // Red-600
    },
    warning: {
      main: '#f59e0b', // Amber-500
      light: '#fbbf24', // Amber-400
      dark: '#d97706', // Amber-600
    },
    info: {
      main: '#3b82f6', // Blue-500
      light: '#60a5fa', // Blue-400
      dark: '#2563eb', // Blue-600
    },
    success: {
      main: '#10b981', // Emerald-500
      light: '#34d399', // Emerald-400
      dark: '#059669', // Emerald-600
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#111827',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#111827',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#111827',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#111827',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#111827',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#111827',
    },
    body1: {
      fontSize: '0.875rem',
      color: '#474F5EFF',
    },
    body2: {
      fontSize: '0.75rem',
      color: '#6b7280',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          },
        },
        contained: {
          backgroundColor: '#6b7280',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#4b5563',
          },
        },
        outlined: {
          borderColor: '#d1d5db',
          color: '#514A37FF',
          '&:hover': {
            backgroundColor: '#f9fafb',
            borderColor: '#9ca3af',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#f9fafb',
          fontWeight: 600,
          color: '#374151',
        },
        body: {
          color: '#374151',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d1d5db',
            },
            '&:hover fieldset': {
              borderColor: '#9ca3af',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6b7280',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fafafa',
          color: '#374151',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f9fafb',
          borderRight: '1px solid #e5e7eb',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#AD8992FF',
      light: '#c4a0aa',
      dark: '#8b6d76',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9ca3af',
      light: '#d1d5db',
      dark: '#6b7280',
      contrastText: '#ffffff',
    },
    background: {
      default: '#111827',
      paper: '#1f2937',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
    },
    divider: '#374151',
    action: {
      hover: '#374151',
      selected: '#4b5563',
      disabled: '#6b7280',
      disabledBackground: '#374151',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#2563eb',
    },
    success: {
      main: '#34d399',
      light: '#6ee7b7',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#f9fafb',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#f9fafb',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#f9fafb',
    },
    h4: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#f9fafb',
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#f9fafb',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#f9fafb',
    },
    body1: {
      fontSize: '0.875rem',
      color: '#e5e7eb',
    },
    body2: {
      fontSize: '0.75rem',
      color: '#d1d5db',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          },
        },
        contained: {
          backgroundColor: '#4b5563',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#6b7280',
          },
        },
        outlined: {
          borderColor: '#4b5563',
          color: '#d1d5db',
          '&:hover': {
            backgroundColor: '#374151',
            borderColor: '#6b7280',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          borderRadius: 8,
          backgroundColor: '#1f2937',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#1f2937',
        },
        elevation1: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#374151',
          fontWeight: 600,
          color: '#f9fafb',
        },
        body: {
          color: '#e5e7eb',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#374151',
          color: '#e5e7eb',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#4b5563',
            },
            '&:hover fieldset': {
              borderColor: '#6b7280',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#9ca3af',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1f2937',
          borderRight: '1px solid #374151',
        },
      },
    },
  },
});

export const simpleGrayTheme = lightTheme;