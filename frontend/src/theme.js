import { createTheme } from '@mui/material/styles';

// Colors from the Turin coat of arms:
// Blue  → azure heraldic, approx. #003DA5
// Gold  → or heraldic,   approx. #F0B429
const theme = createTheme({
  palette: {
    primary: {
      main: '#003DA5',
      light: '#3366CC',
      dark: '#002475',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F0B429',
      light: '#F5C842',
      dark: '#C48A00',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;
