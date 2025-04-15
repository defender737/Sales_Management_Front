import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

declare module "@mui/material/styles" {

  interface Theme {
    custom: {
      drawerWidth: number;
      shape: {
        borderRadius: number;
      };
    };
  }
  interface ThemeOptions {
    custom?: {
      drawerWidth?: number;
      shape?: {
        borderRadius?: number;
      };
    };
  }
}

const drawerWidth = 240;

// 라이트 테마 팔레트
const lightPalette = {
  mode: 'light' as PaletteMode,
  primary: {
    main: '#46557F',
  },
  secondary: {
    main: '#AB47BC',
  }
};

// 현재는 라이트 테마만 사용
const theme = createTheme({
  palette: {
    ...lightPalette
  },
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '1.6rem',
      fontWeight: 'normal',
    },
    body1: {
      fontSize: '1rem',
      fontWeight : 'normal'
    },
    body2 : {
      fontSize : '0.8rem'
    }
  },
  shape: {
    borderRadius: 4,
  },
  custom: {
    drawerWidth,
  }
});

export default theme;