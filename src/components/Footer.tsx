import { Box, Typography } from '@mui/material';

export default function Footer (){
  return (
    <Box
      component="footer"
      sx={{
        height: 60,
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