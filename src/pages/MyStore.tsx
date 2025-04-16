import {
    Box,
    Typography,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button
} from '@mui/material';
import Grid from '@mui/material/Grid2'
import PageTitle from '../components/PageTitle'
import { useAuthStore } from '../stores/UseAuthStore'
import { useNavigate, Link } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';


const pageTitle = {
    title: '마이스토어',
    subTitle: '내 매장 정보를 관리하고 수정할 수 있습니다.',
};

const businessType = {
    RESTAURANT: '음식점',
    CAFE: '카페',
    CONVENIENCE_STORE: '편의점',
    GENERAL_STORE: '잡화점',
    ETC: '기타'
};

export default function MyPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <Box sx={{ mx: 'auto' }}>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />

            <Grid container spacing={3}>
                {user?.storeList.map((store) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={store.id}>
                        <Card
                            sx={{
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.03)'
                                }
                            }}>
                            <CardActionArea
                                onClick={() => navigate(`/myStore/edit/${store.id}`)}>
                                <CardMedia
                                    component="img"
                                    image={store.fileUrl ? `http://localhost:8080/api${store.fileUrl}` : 'assets/img/storeDefault.png'}
                                    alt={store.storeName}
                                    sx={{
                                        aspectRatio: '2/1',
                                        objectFit: 'cover',
                                        width: '100%'
                                    }}
                                />
                                <CardContent
                                    sx={{
                                        aspectRatio: '16/3',
                                        width: '100%'
                                    }}>
                                    <Typography variant="h6">{store.storeName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {store?.businessType && store.businessType in businessType
                                            ? `${businessType[store.businessType as keyof typeof businessType]}`
                                            : '기타'}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                <Button variant="contained" size="large" sx={{ ml: 2 }} component={Link} to={'/myStore/create'}><AddIcon sx={{ mr: 1 }}/>매장 추가하기</Button>
            </Box>
        </Box>
    );
}