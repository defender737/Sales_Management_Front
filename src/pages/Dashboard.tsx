import {useEffect, useState} from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, InputLabel, Tabs, Tab, Switch, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid2'
import PageTitle from '../components/PageTitle';
import SalesExpenseStatsTab from './dashboardTab/SalesExpenseStatsTab';
import SalesTypeStatsTab from './dashboardTab/SalesTypeStatsTab';
import DeliveryPlatformStatsTab from './dashboardTab/DeliveryPlatformStatsTab';

const pageTitle = {
    title: '대시보드',
    subTitle: '매출 및 지출 현황을 한눈에 확인할 수 있습니다.',
};


export default function Dashboard(){
    const [tabIndex, setTabIndex] = useState(0);
    const [excludeDeliveryFee, setExcludeDeliveryFee] = useState(false);
    const [year, setYear] = useState("2025");
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ mx: 'auto', maxWidth: { md: 200, lg: '100%' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
            <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 230, maxWidth: 500, mb: 2 }}>
                    <InputLabel id="year_select">연도</InputLabel>
                    <Select
                        labelId="year_select"
                        label="연도"
                        defaultValue="2025"
                        variant="outlined"
                        onChange={(e) => {
                            setYear(e.target.value);
                        }}
                    >
                        <MenuItem value="2023">2023</MenuItem>
                        <MenuItem value="2024">2024</MenuItem>
                        <MenuItem value="2025">2025</MenuItem>
                    </Select>
                </FormControl>
            </Box>
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
            <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="매출 지출 통계" />
                    <Tab label="매출 유형별 통계" />
                    <Tab label="배달 플랫폼 통계" />
                </Tabs>
                <FormControlLabel labelPlacement='start' sx={{mr : 1}} control={<Switch 
                      checked={excludeDeliveryFee}
                      onChange={(e) => setExcludeDeliveryFee(e.target.checked)}
                />} label={
                    <Typography variant="subtitle1" color="text.secondary">
                        매출에서 배달 수수료 제외하기
                    </Typography>
                } />
            </Box>
            {tabIndex === 0 && <SalesExpenseStatsTab year={year} isExcludeDeliveryFee={excludeDeliveryFee}/>}
            {tabIndex === 1 && <SalesTypeStatsTab year={year} isExcludeDeliveryFee={excludeDeliveryFee}/>}
            {tabIndex === 2 && <DeliveryPlatformStatsTab year={year} isExcludeDeliveryFee={excludeDeliveryFee}/>}
        </Box>
    );
};