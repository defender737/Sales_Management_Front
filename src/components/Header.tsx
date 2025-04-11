// src/components/Header.tsx
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import { FormControl, InputLabel, Select, MenuItem, Box, Toolbar, Typography, Avatar, Button, Tooltip, Menu, Divider, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../stores/UseAuthStore';
import AddStoreButton from '@mui/icons-material/AddBusiness'
import {useSelectedStore} from '../stores/UseSelectedStore'

const drawerWidth = 240;

interface HeaderProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

interface StyledAppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Header = ({ open, handleDrawerOpen }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { selectedStoreId, setSelectedStoreId } = useSelectedStore();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const openMenu = Boolean(anchorEl);

  const {user} = useAuthStore();

  return (
    <AppBar position="fixed" open={open}
      sx={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
      }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap component="div">
              Tally
            </Typography>
            <FormControl sx={{ minWidth: 300, ml: 4}} size="small">
              <Select
                id="storeSelect"
                displayEmpty
                value={selectedStoreId ?? ''}
                onChange={(e) => setSelectedStoreId(Number(e.target.value))}
                renderValue={(selected) => {
                  const store = user?.storeList.find((s) => s.id === selected);
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {store 
                      ?                       
                      <Avatar sx={{ bgcolor: "green", width: 30, height: 30 }}>
                        <StoreIcon fontSize="small" />
                      </Avatar>
                      :
                      <></>
                      }
                      <Typography sx={{ ml: 1 }}>{store?.storeName ?? '가게를 선택해주세요'}</Typography>
                    </Box>
                  );
                }}
              >
                {Array.isArray(user?.storeList) 
                ?
                  user?.storeList.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      <Box sx={{display : 'flex', alignItems : 'center'}}>
                        <Avatar sx={{ bgcolor: "green", width: 30, height: 30 }}>
                          <StoreIcon fontSize='small'/>
                        </Avatar>
                      </Box>
                      <ListItemText sx={{ml : 1}}>{store.storeName}</ListItemText>
                    </MenuItem>
                  ))
                  :
                  <MenuItem key={"noStore"} value={-1}>
                  <ListItemText sx={{ml : 1}}>우리가게를 추가해주세요</ListItemText>
                </MenuItem>
                }
              </Select>
            </FormControl>
            <Tooltip title="가게 추가" arrow >
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="addStore"
                sx={{ ml: 1 }}
              >
                <AddStoreButton />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box onClick={handleAvatarClick} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 3 }} >
              <Avatar sx={{ bgcolor: "orange" }}>
                {user?.name?.charAt(0) ?? 'U'}
              </Avatar>
              <Box sx={{ ml: 1 }}>
                <Typography variant="body1" sx={{ mb: -0.4 }}>
                  {user?.name ?? '사용자'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {user?.email ?? '이메일 없음'}
                </Typography>
              </Box>
            </Box>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}
            sx={{ mt: 1}}
            slotProps={{ paper: { sx : {width: 230, maxWidth: '100%' }}}}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            >
              <MenuItem>
                <PersonIcon />
                <ListItemText sx={{ml : 1}}>내 정보</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <StoreIcon />
                <ListItemText sx={{ml : 1}}>내 가게 정보</ListItemText>
              </MenuItem>
            </Menu>
            <Tooltip title="로그아웃" arrow >
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="logout"
                sx={{ ml: 2 }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar >
  );
};

export default Header;