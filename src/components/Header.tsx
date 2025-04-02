import { AppBar, Toolbar, Typography, Button} from "@mui/material";

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor : "white", color: "black", boxShadow: "none"}}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Tally
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
