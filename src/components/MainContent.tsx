import React from "react";
import {Routes, Route} from "react-router-dom";
import { Box, Toolbar} from "@mui/material";
import NotFound from "./NotFound";
import SalesExpenseRecords from "./SalesExpenseRecords";
import Login from "./Login";
import PrivateRoute from "./routingComponents/PrivateRoute";

const MainContent = () => {
  return (
  <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "white" }}>
    <Toolbar />
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/sales-expenses" element={<SalesExpenseRecords />} />
    </Route>
    </Routes>
  </Box>
  );
};

export default MainContent;