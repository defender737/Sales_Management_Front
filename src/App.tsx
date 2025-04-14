import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Theme from './styles/Theme';
import { Box, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer"
import MainContent from "./components/MainContent";
import Login from "./pages/Login";
import SignupForm from "./pages/SignupForm";
import { SnackbarProvider } from './components/SnackbarProvier';
import PublicOnlyRoute from './components/routingComponents/PublicOnlyRoute';
import RedirectRoute from './components/routingComponents/RedirectRoute';
import {UseAuthInitializer} from './hooks/UseAuthInitializer'


export default function App() {
  UseAuthInitializer();

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
            <SnackbarProvider>
              <Routes>
                <Route path="/" element={<RedirectRoute />} />

                <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignupForm />} />
                </Route>
                {/* <Route path="*" element={<NotFound />} /> */}
                <Route
                  path="/*"
                  element={
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
      </Router>
    </ThemeProvider>
  );
}