import {Routes, Route} from "react-router-dom";
import { Box, Toolbar} from "@mui/material";
import ExpenseRecordsPage from "../pages/ExpenseRecordsPage";
import PrivateRoute from "./routingComponents/PrivateRoute";
import {useAuthStore} from "../stores/useAuthStore"
import NoStorePromptPage from "../pages/NoStorePromptPage";
import StoreDetailPage from "../pages/StoreDetailPage"
import MyPage from "../pages/MyPage";
import MyStorePage from "../pages/MyStorePage";
import Dashboard from "../pages/Dashboard";
import DeliveryManagementPage from "../pages/DeliveryManagementPage";
import SalesRecordsPage from "../pages/SalesRecordsPage";

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
      <Route path="/salesRecord" element={isStoreExsist ? <SalesRecordsPage /> : <NoStorePromptPage />} />
      <Route path="/expenseRecord" element={isStoreExsist ? <ExpenseRecordsPage /> : <NoStorePromptPage />} />
      <Route path="/deliveryManagement" element={isStoreExsist ? <DeliveryManagementPage /> : <NoStorePromptPage />} />

      <Route path="/myStore" element={<MyStorePage />} />
      <Route path="/myStore/create" element={<StoreDetailPage />} />
      <Route path="/myStore/edit/:id" element={<StoreDetailPage />} />
      
      <Route path="/mypage" element={<MyPage />} />
      </Route>
    </Routes>
  </Box>
  );
};

export default MainContent;