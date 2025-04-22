import React from "react";
import {Routes, Route} from "react-router-dom";
import { Box, Toolbar} from "@mui/material";
import SalesExpenseRecords from "../pages/SalesExpenseRecords";
import PrivateRoute from "./routingComponents/PrivateRoute";
import {useAuthStore} from "../stores/useAuthStore"
import NoStorePromptPage from "../pages/NoStorePromptPage";
import StoreForm from "../pages/StoreForm"
import MyPage from "../pages/MyPage";
import MyStore from "../pages/MyStore";
import Dashboard from "../pages/Dashboard";

const MainContent = () => {
  const { user } = useAuthStore();
  const storerList = user?.storeList
  // const storerList = new Array(0)
  const isStoreExsist = (storerList !== undefined && storerList.length >0 && storerList) ? true : false
  return (
  <Box component="main" sx={{ flexGrow: 1, p: 5, bgcolor: "white", minWidth: 0 }}>
    <Toolbar />
    <Routes>
      <Route element={<PrivateRoute />}>
      <Route path="/sales-expenses" element={isStoreExsist ? <SalesExpenseRecords /> : <NoStorePromptPage />} />
      <Route path="/myStore/create" element={<StoreForm />} />
      <Route path="/myStore/edit/:id" element={<StoreForm />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/myStore" element={<MyStore />} />
      <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </Box>
  );
};

export default MainContent;