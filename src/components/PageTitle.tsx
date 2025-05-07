import { Box, Typography } from '@mui/material';
import {pageTitle} from '../types/types';

const PageTitle = ({title, subTitle} : pageTitle) => {
    return (
      <Box sx={{mb : 3}}>
        <Typography variant="h1">{title}</Typography>
        <Typography sx={{ color: 'text.secondary', mt : 1}}>{subTitle}</Typography>
      </Box>
    );
};

export default PageTitle;