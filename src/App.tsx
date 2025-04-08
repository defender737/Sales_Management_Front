import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Theme from './styles/Theme';
import { Box, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer"
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import SignupForm from "./components/SignupForm";
import { SnackbarProvider } from './components/SnackbarProvier';
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from './components/AuthProvider';

export default function App() {

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <CookiesProvider>
          <AuthProvider>
            <SnackbarProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route
                  path="/*"
                  element={
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                      <Header />
                      <Sidebar />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <MainContent />
                        <Footer />
                      </Box>
                    </Box>
                  }
                />
              </Routes>
            </SnackbarProvider>
          </AuthProvider>
        </CookiesProvider>
      </Router>
    </ThemeProvider>
  );
}