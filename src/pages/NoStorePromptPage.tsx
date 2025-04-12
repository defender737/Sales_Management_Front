// src/pages/NoStorePromptPage.tsx
import { Box, Typography, Button } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useNavigate } from 'react-router-dom';

const NoStorePromptPage = () => {
  const navigate = useNavigate();

  const handleAddStoreClick = () => {
    navigate('/store/create'); // 매장 생성 페이지 경로
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
      }}
    >
      <StorefrontIcon sx={{ fontSize: 100, mb: 2, color: 'grey.700' }} />
      <Typography variant="h4" gutterBottom>
        아직 등록된 매장이 없습니다
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        매장을 추가하여 매출을 기록하고 관리해보세요.
      </Typography>
      <Button variant="contained" color="primary" size="large" onClick={handleAddStoreClick}>
        매장 추가하기
      </Button>
    </Box>
  );
};

export default NoStorePromptPage;