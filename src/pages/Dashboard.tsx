import React from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import Grid from '@mui/material/Grid2'
import PageTitle from '../components/PageTitle';

const pageTitle = {
    title: '대시보드',
    subTitle: '매출 및 지출 현황을 한눈에 확인할 수 있습니다.',
};

const Dashboard = () => {
    return (
        <Box sx={{ mx: 'auto' }}>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
            <Box sx={{display : 'flex', gap : 2}}>
            <FormControl sx={{ minWidth: 230, maxWidth: 500, mb : 2}}>
            <InputLabel id="year_select">연도</InputLabel>
                <Select
                    labelId="year_select"
                    label="연도"
                    defaultValue="2023"
                    variant="outlined"
                >
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 230, maxWidth: 500, mb : 2}}>
            <InputLabel id="month_select">월</InputLabel>
                <Select
                                    labelId="month_select"
                    defaultValue="2023"
                    label="월"
                    variant="outlined"
                >
                    <MenuItem value="2023">1월</MenuItem>
                    <MenuItem value="2024">2월</MenuItem>
                    <MenuItem value="2025">3월</MenuItem>
                </Select>
            </FormControl>
            </Box>
            {/* 상단 총 요약 */}
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">수입 총액</Typography>
                        <Typography variant="h4" fontWeight="bold">263,300,000원</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">지출 총액</Typography>
                        <Typography variant="h4" fontWeight="bold">213,400,000원</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6">순수익</Typography>
                        <Typography variant="h4" fontWeight="bold">49,900,000원</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 수입/지출 현황</Typography>
                        <Box height={300} bgcolor="#f5f5f5" />
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 [수익] 변동</Typography>
                        <Box height={300} bgcolor="#f5f5f5" />
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box display="flex" flexDirection="column" gap={2} height="100%">
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>결제수단별 지출 현황</Typography>
                            <Box height={140} bgcolor="#f5f5f5" />
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>결제수단 트렌드</Typography>
                            <Box height={140} bgcolor="#f5f5f5" />
                        </Paper>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>결제수단 비율</Typography>
                        <Box height={300} bgcolor="#f5f5f5" />
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>월별 수입/지출 내역</Typography>
                        <Box height={300} bgcolor="#f5f5f5" />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
