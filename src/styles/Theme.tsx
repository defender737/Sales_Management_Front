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
    light: '#DBE2EF',
    main: '#3F72AF',
    dark: '#112D4E',
  },
  secondary: {
    main: '#DBE2EF',
  },
  background: {
    default: '#F9F7F7',
    paper: '#ffffff',
  },
  text: {
    primary: '#000000',
  },
  error: {
    main: '#D32F2F',     // 강한 빨강 (기본 MUI error)
    light: '#FFCDD2',
    dark: '#C62828',
    contrastText: '#fff',
  },
  warning: {
    main: '#FFA000',
    light: '#FFE082',
    dark: '#FF6F00',
    contrastText: '#000',
  },
  info: {
    main: '#0288D1',
    light: '#B3E5FC',
    dark: '#01579B',
    contrastText: '#fff',
  },
  success: {
    main: '#388E3C',
    light: '#C8E6C9',
    dark: '#2E7D32',
    contrastText: '#fff',
  },
};

// 다크 테마 팔레트
const darkPalette = {
  mode: 'dark' as PaletteMode,
  primary: {
    light: '#5f9df7',
    main: '#3F72AF',
    dark: '#0e1a3d',
  },
  secondary: {
    main: '#607D8B',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
  },
};

// 현재는 라이트 테마로 설정
const theme = createTheme({
  palette: lightPalette,
  typography: {
    h1: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8, // ← 원하는 radius 값
  },
  custom: {
    drawerWidth,
  }
});

export default theme;