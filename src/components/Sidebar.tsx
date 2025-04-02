import { List, ListItem, ListItemText, ListItemIcon, Divider, Box, Drawer, Toolbar, ListItemButton} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {useTheme} from "@mui/material/styles";

const menuItems1 = [
  { text: "매출/지출 기록", icon: <MonetizationOnIcon />, path : "/sales-expenses" },
  { text: "메출 통계", icon: <BarChartIcon />, path : "/Login" },
  { text: "순매출 관리", icon: <SettingsIcon />, path : "/" }
];

const menuItems2 = [
  { text: "보고서", icon: <ReceiptIcon />, path : "/" },
  { text: "지원", icon: <HelpOutlineIcon />, path : "/" },
  { text: "설정", icon: <SettingsIcon />, path : "/" }
];

const Sidebar = () => {
  const theme = useTheme();

  return (
    <Drawer
    variant="permanent" // 화면에 항상 고정됨(스크롤해도 사라지지 않음)
    sx={{
      width: theme.custom.drawerWidth,
      flexShrink: 0, // 사이드바가 축소되지 않도록 설정
      [`& .MuiDrawer-paper`]: { width: theme.custom.drawerWidth, boxSizing: 'border-box' },
    }}
  >
   <Toolbar />  {/*Toolbar는 Appbar(헤더)와 정렬을 맞추기 위한 공간(없으면 겹침) */}
    <Box sx={{ overflow: 'auto' }}>  {/*사이드바가 넘치면 스크롤바 생성*/}
    <List>
          <ListItem key={"대시보드"} disablePadding>
            <ListItemButton component = {Link} to={"/"}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={"대시보드"} />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <List>
      {menuItems1.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component = {Link} to={path}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
      {menuItems2.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component = {Link} to={path}>
              <ListItemIcon>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
  );
};

export default Sidebar;