import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import {pageTitle} from '../types/types';

const PageTitle = ({title, subTitle} : pageTitle) => {
    return (
        <Card sx={{bgcolor: "white", mb: 3, boxShadow : "none"}}>
      <Box sx={{}}>
        <Typography variant="h1">{title}</Typography>
        <Typography sx={{ color: 'text.secondary', mt : 1}}>{subTitle}</Typography>
      </Box>
    </Card>
    );
};

export default PageTitle;