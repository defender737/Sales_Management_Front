import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        height: 60,
        bgcolor: "white",
        textAlign: 'center',
        p: 2,
        mt : 'auto'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 defender737. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;