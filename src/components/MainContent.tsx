import React from "react";
import {Routes, Route} from "react-router-dom";
import { Box, Toolbar} from "@mui/material";
import ExpenseRecords from "../pages/ExpenseRecords";
import PrivateRoute from "./routingComponents/PrivateRoute";
import {useAuthStore} from "../stores/useAuthStore"
import NoStorePromptPage from "../pages/NoStorePromptPage";
import StoreForm from "../pages/StoreForm"
import MyPage from "../pages/MyPage";
import MyStore from "../pages/MyStore";
import Dashboard from "../pages/Dashboard";
import DeliveryManagement from "../pages/DeliveryManagement";
import SalesRecord from "../pages/SalesRecords";

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
      <Route path="/dashboard" element={isStoreExsist ? <Dashboard /> : <NoStorePromptPage />} />
      <Route path="/salesRecord" element={isStoreExsist ? <SalesRecord /> : <NoStorePromptPage />} />
      <Route path="/expenseRecord" element={isStoreExsist ? <ExpenseRecords /> : <NoStorePromptPage />} />
      <Route path="/deliveryManagement" element={isStoreExsist ? <DeliveryManagement /> : <NoStorePromptPage />} />

      <Route path="/myStore" element={<MyStore />} />
      <Route path="/myStore/create" element={<StoreForm />} />
      <Route path="/myStore/edit/:id" element={<StoreForm />} />
      
      <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  </Box>
  );
};

export default MainContent;