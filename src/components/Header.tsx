// src/components/Header.tsx
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import { FormControl, InputLabel, Select, MenuItem, Box, Toolbar, Typography, Avatar, Button, Tooltip, Menu, Divider, ListItemText } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

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

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const openMenu = Boolean(anchorEl);

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
            <FormControl sx={{ minWidth: 300, ml: 4 }} size="small">
              <Select
                id="demo-simple-select"
              //value={age}
              //onChange={handleChange}
              >
                <MenuItem value={10}>가게 1</MenuItem>
                <MenuItem value={20}>가게 2</MenuItem>
                <MenuItem value={30}>가게 3</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box onClick={handleAvatarClick} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mr: 3 }} >
              <Avatar sx={{ bgcolor: "orange" }}>N</Avatar>
              <Box sx={{ ml: 1 }}>
                <Typography variant="body1" sx={{ mb: -0.4 }}>
                  이신욱
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  er888@naver.com
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