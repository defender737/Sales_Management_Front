import { Typography, Box } from '@mui/material';

interface ModalTitleProps {
  title: string;
  subTitle?: string;
}

const ModalTitle = ({ title, subTitle }: ModalTitleProps) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="h5" fontWeight={600}>{title}</Typography>
    {subTitle && (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {subTitle}
      </Typography>
    )}
  </Box>
);

export default ModalTitle;