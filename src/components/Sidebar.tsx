import { Link } from 'react-router-dom';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import Header from './Header';
import { Typography } from '@mui/material';
import { useSidebarStatus } from '../stores/useSidebarStatusStore'
const drawerWidth = 240; // Drawer의 너비를 정의

// Drawer가 열릴 때의 스타일을 정의
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden', // 가로 스크롤 숨김
});

// Drawer가 닫힐 때의 스타일을 정의
const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden', // 가로 스크롤 숨김
  width: `calc(${theme.spacing(7)} + 1px)`, // 좁은 상태의 너비
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`, // 작은 화면 이상에서의 너비
  },
});

// DrawerHeader의 스타일을 정의
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end', // DrawerHeader 내 아이콘을 오른쪽으로 정렬
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar, // AppBar 아래의 공간 확보
}));

// Drawer를 styled로 커스터마이징
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth, // Drawer의 기본 너비
    flexShrink: 0,
    whiteSpace: 'nowrap', // Drawer 내용이 한 줄로 표시되도록 설정
    boxSizing: 'border-box', // 박스 모델의 계산 방식 설정
    variants: [
      {
        props: ({ open }) => open, // open 상태에 따라 스타일 변경
        style: {
          ...openedMixin(theme), // Drawer가 열릴 때의 스타일
          '& .MuiDrawer-paper': openedMixin(theme), // Drawer의 종이 부분 스타일
        },
      },
      {
        props: ({ open }) => !open, // open 상태가 아닐 때의 스타일
        style: {
          ...closedMixin(theme), // Drawer가 닫힐 때의 스타일
          '& .MuiDrawer-paper': closedMixin(theme), // Drawer의 종이 부분 스타일
        },
      },
    ],
  }),
);

const menuItems1 = [
  { text: "매출/지출 기록", icon: <MonetizationOnIcon />, path: "/sales-expenses" },
  { text: "메출 통계", icon: <BarChartIcon />, path: "/Login" },
  { text: "순매출 관리", icon: <SettingsIcon />, path: "/" }
];

const menuItems2 = [
  { text: "보고서", icon: <ReceiptIcon />, path: "/" },
  { text: "지원", icon: <HelpOutlineIcon />, path: "/" },
  { text: "설정", icon: <SettingsIcon />, path: "/" }
];

// Sidebar 컴포넌트 정의
export default function Sidebar() {
  const theme = useTheme(); // 현재 테마 사용
  const { sidebarOpen, setSideBarOpen } = useSidebarStatus();
  //const [open, setOpen] = useState(true); // Drawer의 열림 상태 관리

  // Drawer 열기 핸들러
  const handleDrawerOpen = () => {
    setSideBarOpen(true);
  };

  // Drawer 닫기 핸들러
  const handleDrawerClose = () => {
    setSideBarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header open={sidebarOpen} handleDrawerOpen={handleDrawerOpen} />
      <Drawer variant="permanent" open={sidebarOpen}> {/* Drawer의 open 상태에 따라 스타일 변경 */}
        <DrawerHeader sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {sidebarOpen && (
              <Typography variant="h2" component="div" sx={{ ml: 2 }}>
                Menu
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem key={"대시보드"} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                },
                sidebarOpen
                  ? {
                    justifyContent: 'initial', // Drawer가 열리면 초기 정렬
                  }
                  : {
                    justifyContent: 'center', // Drawer가 닫히면 중앙 정렬
                  },
              ]}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center', // 아이콘 중앙 정렬
                  },
                  sidebarOpen
                    ? {
                      mr: 3, // Drawer가 열리면 오른쪽 여백 추가
                    }
                    : {
                      mr: 'auto', // Drawer가 닫히면 자동 여백
                    },
                ]}
              >
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary={"대시보드"}
                sx={[
                  sidebarOpen
                    ? {
                      opacity: 1, // Drawer가 열리면 텍스트 보임
                    }
                    : {
                      opacity: 0, // Drawer가 닫히면 텍스트 숨김
                    },
                ]}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          {/* 반복되는 리스트 항목 렌더링 */}
          {menuItems1.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={path}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  sidebarOpen
                    ? {
                      justifyContent: 'initial', // Drawer가 열리면 초기 정렬
                    }
                    : {
                      justifyContent: 'center', // Drawer가 닫히면 중앙 정렬
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center', // 아이콘 중앙 정렬
                    },
                    sidebarOpen
                      ? {
                        mr: 3, // Drawer가 열리면 오른쪽 여백 추가
                      }
                      : {
                        mr: 'auto', // Drawer가 닫히면 자동 여백
                      },
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    sidebarOpen
                      ? {
                        opacity: 1, // Drawer가 열리면 텍스트 보임
                      }
                      : {
                        opacity: 0, // Drawer가 닫히면 텍스트 숨김
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {menuItems2.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={Link} to={path}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  sidebarOpen
                    ? {
                      justifyContent: 'initial', // Drawer가 열리면 초기 정렬
                    }
                    : {
                      justifyContent: 'center', // Drawer가 닫히면 중앙 정렬
                    },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center', // 아이콘 중앙 정렬
                    },
                    sidebarOpen
                      ? {
                        mr: 3, // Drawer가 열리면 오른쪽 여백 추가
                      }
                      : {
                        mr: 'auto', // Drawer가 닫히면 자동 여백
                      },
                  ]}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    sidebarOpen
                      ? {
                        opacity: 1, // Drawer가 열리면 텍스트 보임
                      }
                      : {
                        opacity: 0, // Drawer가 닫히면 텍스트 숨김
                      },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}