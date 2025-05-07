import { useEffect, useContext, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import BarChart from '../../components/chart/BarChart';
import LineChart from '../../components/chart/LineChart';
import DataTable from '../../components/chart/DataTable';
import { useApiRequest } from '../../hooks/useApiRequest';
import { getSalesExpenseStatsMonthly, getSalesExpenseStatsDaily } from '../../api/api';
import { useSelectedStore } from '../../stores/useSelectedStore';
import { SnackbarContext } from '../../contexts/SnackbarContext';

interface SalesExpenseStats {
    year: string;
    isExcludeDeliveryCommission : boolean;
    month : string;
    viewMode : string;
}
const chartColor = {
    income : 'rgba(54, 162, 235, 0.8)',
    expense : 'rgba(255, 99, 132, 0.8)'
}

export default function SalesExpenseStatsTab({ year, month, isExcludeDeliveryCommission, viewMode }: SalesExpenseStats) {
    const { selectedStoreId } = useSelectedStore(); 
    const showSnackbar = useContext(SnackbarContext);
    const [summaryData, setSummaryData] = useState<{
        labels: string[]; // 1월, 2월, 3월 ...
        income: number[]; // 매출
        expense: number[]; // 지출
        tableLabels: string[]; // 테이블의 labels 1월, 2월, 3월 ... 총계
        incomeWithTotal: number[]; 
        expenseWithTotal: number[];
    }>({
        labels: [],
        income: [],
        expense: [],
        tableLabels: [],
        incomeWithTotal: [],
        expenseWithTotal: [],
    });

    const transformData = (salesMap: any, expenseMap: any) => {
        const labels = Object.keys(salesMap); // 1월, 2월...
        const withTotal = labels.map((label) => ({
            label,
            income: salesMap[label] ?? 0,
            expense: expenseMap[label] ?? 0,
        }));
        const withoutTotal = withTotal.filter((d) => d.label !== "총계");

        return {
            labels: withoutTotal.map((d) => d.label),
            income: withoutTotal.map((d) => d.income),
            expense: withoutTotal.map((d) => d.expense),
            incomeWithTotal: withTotal.map((d) => d.income),
            expenseWithTotal: withTotal.map((d) => d.expense),
            tableLabels: withTotal.map((d) => d.label),
        };
    };

    const { request } = useApiRequest(
        (storeId: number, year: string, month : string, isExcludeDeliveryCommission : boolean) => 
        viewMode === 'monthly' ?
            getSalesExpenseStatsMonthly(storeId, year, isExcludeDeliveryCommission)
        :
            getSalesExpenseStatsDaily(storeId, year, month, isExcludeDeliveryCommission)
        ,
        (response) => {
            console.log(response.data)
            const salesMap = response.data.salesSummary || {};
            const expenseMap = response.data.expenseSummary || {};
            setSummaryData(transformData(salesMap, expenseMap));
        },
        (msg) => showSnackbar(msg, "error"),
    );

    const dataSetsForBarChart = [
        { label: '매출', data: summaryData.income, backgroundColor: chartColor.income },
        { label: '지출', data: summaryData.expense, backgroundColor: chartColor.expense },
    ];

    const dataSetsForLineChart = [
        { label: '매출', data: summaryData.income, borderColor: chartColor.income },
        { label: '지출', data: summaryData.expense, borderColor: chartColor.expense },
    ];

    const TabledataSets = [
        { label: '매출', data: summaryData.incomeWithTotal },
        { label: '지출', data: summaryData.expenseWithTotal },
    ];

    useEffect(() => {
        if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
        request(selectedStoreId, year, month, isExcludeDeliveryCommission);
    }, [selectedStoreId, year, month, isExcludeDeliveryCommission, viewMode]);
    return (
        <>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 매출/지출 현황</Typography>
                        <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }} >
                            <BarChart labels={summaryData.labels} datasets={dataSetsForBarChart} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 매출/지출 변동</Typography>
                        <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                            <LineChart labels={summaryData.labels} dataSets={dataSetsForLineChart} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>월별 매출/지출 상세</Typography>
                        <Box>
                            <DataTable headers={summaryData.tableLabels} rows={TabledataSets} tableRow='netProfit' />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}