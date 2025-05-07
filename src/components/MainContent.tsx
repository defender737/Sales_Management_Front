import { Routes, Route } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { useAuthStore } from "../stores/useAuthStore";
import { useSelectedStore } from '../stores/useSelectedStore';
import PrivateRoute from "./routingComponents/PrivateRoute";
import ExpenseRecordsPage from "../pages/ExpenseRecordsPage";
import DeliveryManagementPage from "../pages/DeliveryManagementPage";
import NoStorePromptPage from "../pages/NoStorePromptPage";
import StoreDetailPage from "../pages/StoreDetailPage";
import SalesRecordsPage from "../pages/SalesRecordsPage";
import MyPage from "../pages/MyPage";
import MyStorePage from "../pages/MyStorePage";
import Dashboard from "../pages/Dashboard";
import HelpPage from "../pages/HelpPage";

export default function MainContent() {
  const { user } = useAuthStore();
  const { selectedStoreId } = useSelectedStore();
  const storeList = user?.storeList;
  const isStoreLoading = storeList === undefined;
  const isStoreExist = Array.isArray(storeList) && storeList.length > 0;
  const isStoreSelected = selectedStoreId !== null;

  if (isStoreLoading || (isStoreExist && !isStoreSelected)) {
    return null;
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 5, minWidth: 0 }}>
      <Toolbar />
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/myStore" element={<MyStorePage />} />
          <Route path="/myStore/create" element={<StoreDetailPage />} />
          <Route path="/myStore/edit/:id" element={<StoreDetailPage />} />

          <Route path="/dashboard" element={isStoreExist ? <Dashboard /> : <NoStorePromptPage />} />
          <Route path="/salesRecord" element={isStoreExist ? <SalesRecordsPage /> : <NoStorePromptPage />} />
          <Route path="/expenseRecord" element={isStoreExist ? <ExpenseRecordsPage /> : <NoStorePromptPage />} />
          <Route path="/deliveryManagement" element={isStoreExist ? <DeliveryManagementPage /> : <NoStorePromptPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Route>
      </Routes>
    </Box>
  );
};