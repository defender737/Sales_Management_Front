import React from "react";
import {Routes, Route} from "react-router-dom";
import { Box, Toolbar} from "@mui/material";
import SalesExpenseRecords from "../pages/SalesExpenseRecords";
import PrivateRoute from "./routingComponents/PrivateRoute";
import {useAuthStore} from "../stores/UseAuthStore"
import NoStorePromptPage from "../pages/NoStorePromptPage";
import AddStoreForm from "../pages/AddStoreForm"
import MyPage from "../pages/MyPage";

const MainContent = () => {
  const { user } = useAuthStore();
  const storerList = user?.storeList
  // const storerList = new Array(0)
  const isStoreExsist = (storerList !== undefined && storerList.length >0 && storerList) ? true : false
  return (
  <Box component="main" sx={{ flexGrow: 1, p: 5, bgcolor: "white" }}>
    <Toolbar />
    <Routes>
      <Route element={<PrivateRoute />}>
      <Route path="/sales-expenses" element={isStoreExsist ? <SalesExpenseRecords /> : <NoStorePromptPage />} />
      <Route path="/store/create" element={<AddStoreForm />} />
      <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  </Box>
  );
};

export default MainContent;