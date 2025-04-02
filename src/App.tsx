import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Theme from './styles/Theme';
import { Box, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer"
import MainContent from "./components/MainContent";
import { SnackbarProvider } from './components/SnackbarProvier';

export default function App() {

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight : '100vh'}}>
          <Header />
          <Sidebar />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <SnackbarProvider>
              <MainContent />
            </SnackbarProvider>
            <Footer />
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}