import { useState, useContext, useEffect } from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, InputLabel, Tabs, Tab, Switch, FormControlLabel, Tooltip, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid2'
import PageTitle from '../components/PageTitle';
import SalesExpenseStatsTab from './dashboardTab/SalesExpenseStatsTab';
import SalesTypeStatsTab from './dashboardTab/SalesTypeStatsTab';
import DeliveryPlatformStatsTab from './dashboardTab/DeliveryPlatformStatsTab';
import { useApiRequest } from '../hooks/useApiRequest';
import { getTotalFinancialSummaryMonthly, getTotalFinancialSummaryYearly, getFirstYear } from '../api/api'
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useSelectedStore } from '../stores/useSelectedStore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Toggle from '../components/Toggle'

const pageTitle = {
    title: '대시보드',
    subTitle: '매출 및 지출 현황을 한눈에 확인할 수 있습니다.',
};

export default function Dashboard() {
    const showSnackbar = useContext(SnackbarContext);
    const [tabIndex, setTabIndex] = useState(0);
    const [excludeDeliveryCommission, setExcludeDeliveryCommission] = useState(false);
    const [firstYear, setFirstYear] = useState('2025')
    const [year, setYear] = useState("2025");
    const [month, setMonth] = useState("1");
    const { selectedStoreId } = useSelectedStore();
    const [viewMode, setViewMode] = useState<string>('monthly');
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };
    const { request: FincancialSummaryRequest } = useApiRequest(
        (storeId: number, year: string, month : string) => 
            viewMode === 'monthly'
        ?
            getTotalFinancialSummaryYearly(storeId, year)
        :
            getTotalFinancialSummaryMonthly(storeId, year, month),
        (response) => {
            const { totalSales, totalExpenses, totalCommission, netProfit } = response.data;
            setSummary({ totalSales: totalSales, totalExpenses: totalExpenses, totalCommission: totalCommission, netProfit: netProfit });
        },
        (msg) => showSnackbar(msg, "error")
    )
    const { request: firstYearRequest } = useApiRequest(
        (storeId: number) => getFirstYear(storeId),
        (response) => {
            setFirstYear(response.data)
        },
        (msg) => showSnackbar(msg, 'error')
    )

    const [summary, setSummary] = useState({
        totalSales: 0,
        totalExpenses: 0,
        totalCommission: 0,
        netProfit: 0,
    });

    useEffect(() => {
        if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
        firstYearRequest(selectedStoreId)
        FincancialSummaryRequest(selectedStoreId, year, month);

    }, [selectedStoreId, year, month, viewMode])

    const handleViewModeChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        setViewMode(value);
    }

    return (
        <Box sx={{ mx: 'auto', maxWidth: { md: 200, lg: '100%' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Toggle value={viewMode} onChange={handleViewModeChange} buttons={[
                        { label: "연도별", value: "monthly" },
                        { label: "월별", value: "daily" },
                    ]} />
                    <FormControl sx={{ minWidth: 230, maxWidth: 500 }}>
                        <InputLabel id="year_select">연도</InputLabel>
                        <Select
                            labelId="year_select"
                            label="연도"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        >
                            {Array.from({ length: new Date().getFullYear() - Number(firstYear) + 1 }, (_, i) => {
                                const y = Number(firstYear) + i;
                                return (
                                    <MenuItem key={y} value={y.toString()}>
                                        {y}년
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Collapse in={viewMode === "daily"} orientation="horizontal">        
                    <FormControl sx={{ minWidth: 150, maxWidth: 500 }}>
                        <InputLabel id="year_select">월</InputLabel>
                        <Select
                            labelId="month_select"
                            label="월"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {Array.from({ length: 12 }, (_, i) => {
                                const m = i + 1;
                                return (
                                    <MenuItem key={m} value={m.toString()}>
                                        {m}월
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    </Collapse>
                </Box>
            </Box>
            {/* 상단 총 요약 */}
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, minWidth: 400 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6">매출 총액</Typography>
                            <Tooltip
                                title={`배달 플랫폼 수수료 ${summary.totalCommission}원이 제외된 금액입니다.`}
                                placement='top'
                                slotProps={{
                                    tooltip: {
                                        sx: {
                                            fontSize: '14px',
                                            padding: '8px 10px',
                                        },
                                    },
                                }}
                            >
                                <HelpOutlineIcon sx={{ width: 18, height: 18, color: 'text.secondary' }} />
                            </Tooltip>
                        </Box>
                        <Typography variant="h4" fontWeight="bold">{summary.totalSales}원</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, minWidth: 400 }}>
                        <Typography variant="h6">지출 총액</Typography>
                        <Typography variant="h4" fontWeight="bold">{summary.totalExpenses}원</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, minWidth: 400 }}>
                        <Typography variant="h6">순수익</Typography>
                        <Typography variant="h4" fontWeight="bold">{summary.netProfit}원</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="매출 지출 통계" />
                    <Tab label="매출 유형별 통계" />
                    <Tab label="배달 플랫폼 통계" />
                </Tabs>
                <FormControlLabel labelPlacement='start' sx={{ mr: 1 }} control={<Switch
                    checked={excludeDeliveryCommission}
                    onChange={(e) => setExcludeDeliveryCommission(e.target.checked)}
                />} label={
                    <Typography variant="subtitle1" color="text.secondary">
                        매출에서 배달 수수료 제외하기
                    </Typography>
                } />
            </Box>
            {tabIndex === 0 && <SalesExpenseStatsTab year={year} month={month} isExcludeDeliveryCommission={excludeDeliveryCommission} viewMode = {viewMode}/>}
            {tabIndex === 1 && <SalesTypeStatsTab year={year} month={month} isExcludeDeliveryCommission={excludeDeliveryCommission} viewMode = {viewMode} />}
            {tabIndex === 2 && <DeliveryPlatformStatsTab year={year} month={month} isExcludeDeliveryCommission={excludeDeliveryCommission} viewMode = {viewMode} />}
        </Box>
    );
};