import { createTheme } from '@mui/material/styles';

export const simpleGrayTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6b7280', // Gray-500
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
      secondary: '#6b7280', // Gray-500
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
      color: '#374151',
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
          color: '#374151',
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