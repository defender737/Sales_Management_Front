import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <Box sx={{ display: "flex", height: "calc(100vh - clamp(50px, 8vh, 80px))", marginTop: "clamp(50px, 8vh, 80px)" }}>
      <Sidebar />
      <MainContent />
    </Box>
  );
};

export default Layout;