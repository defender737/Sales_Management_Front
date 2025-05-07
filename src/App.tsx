import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Theme from './styles/Theme';
import { Box, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer"
import MainContent from "./components/MainContent";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { SnackbarProvider } from './components/SnackbarProvier';
import PublicOnlyRoute from './components/routingComponents/PublicOnlyRoute';
import RedirectRoute from './components/routingComponents/RedirectRoute';
import {useAuthInitializer} from './hooks/useAuthInitializer'
import GlobalModals from './components/GlobalModals' 
import FindPasswordPage from './pages/FindPasswordPage'


export default function App() {
  useAuthInitializer();

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
            <SnackbarProvider>
            <GlobalModals />
              <Routes>
                <Route path="/" element={<RedirectRoute />} />
                {/* <Route path="*" element={<NotFound />} /> */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/findPassword" element={<FindPasswordPage />} />
                </Route>
                <Route
                  path="/*"
                  element={
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                      <Sidebar />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, overflowX: 'hidden' }}>
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