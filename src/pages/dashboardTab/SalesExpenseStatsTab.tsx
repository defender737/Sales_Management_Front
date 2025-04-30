import { useEffect, useContext, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import BarChart from '../../components/chart/BarChart';
import LineChart from '../../components/chart/LineChart';
import DataTable from '../../components/chart/dataTable';
import { useApiRequest } from '../../hooks/useApiRequest';
import { getSalesExpenseStats } from '../../api/api';
import { useSelectedStore } from '../../stores/useSelectedStore';
import { SnackbarContext } from '../../contexts/SnackbarContext';

interface SalesExpenseStats {
    year: string;
    isExcludeDeliveryFee : boolean
}

const blue = 'rgba(54, 162, 235, 0.8)';
const red = 'rgba(255, 99, 132, 0.8)'

export default function SalesExpenseStatsTab({ year, isExcludeDeliveryFee }: SalesExpenseStats) {
    const { selectedStoreId } = useSelectedStore(); 
    const showSnackbar = useContext(SnackbarContext);
    const [income, setIncome] = useState<number[]>([]);
    const [expenses, setExpenses] = useState<number[]>([]);
    const [incomeWidthoutTotal, setincomeWidthoutTotal] = useState<number[]>([]);
    const [expensesWidthoutTotal, setExpensesWidthoutTotal] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]); 
    const [tableLabels, setTableLabels] = useState<string[]>([]);

    const { request, loading } = useApiRequest(
        (storeId: number, year: string, isExcludeDeliveryFee : boolean) => getSalesExpenseStats(storeId, year, isExcludeDeliveryFee),
        (response) => {
            console.log(response.data)
            const salesMap = response.data.salesSummaryMap || {};
            const expenseMap = response.data.expenseSummaryMap || {};

            const allLabels = Object.keys(salesMap);

            const dataWithTotal = allLabels.map(label => ({
                label,
                income: salesMap[label] ?? 0,
                expense: expenseMap[label] ?? 0
            }));

            const dataWithoutTotal = dataWithTotal.filter(item => item.label !== '총계');

   
            setLabels(dataWithoutTotal.map(item => item.label));
            setIncome(dataWithoutTotal.map(item => item.income));
            setExpenses(dataWithoutTotal.map(item => item.expense));

            setincomeWidthoutTotal(dataWithTotal.map(item => item.income));
            setExpensesWidthoutTotal(dataWithTotal.map(item => item.expense));
            setTableLabels(dataWithTotal.map(item => item.label));
        },
        (msg) => showSnackbar(msg, "error"),
    );

    const dataSetsForBarChart = [
        { label: '매출', data: income, backgroundColor: blue },
        { label: '지출', data: expenses, backgroundColor: red },
    ];

    const dataSetsForLineChart = [
        { label: '매출', data: income, borderColor: blue },
        { label: '지출', data: expenses, borderColor: red },
    ];

    const TabledataSets = [
        { label: '매출', data: incomeWidthoutTotal, borderColor: blue },
        { label: '지출', data: expensesWidthoutTotal, borderColor: red },
    ];

    useEffect(() => {
        if (!selectedStoreId) return showSnackbar("메장 정보를 찾을 수 없습니다.", "error");
        request(selectedStoreId, year, isExcludeDeliveryFee);
    }, [selectedStoreId, year, isExcludeDeliveryFee]);
    return (
        <>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 매출/지출 현황</Typography>
                        <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }} >
                            <BarChart labels={labels} datasets={dataSetsForBarChart} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 매출/지출 변동</Typography>
                        <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                            <LineChart labels={labels} dataSets={dataSetsForLineChart} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>월별 매출/지출 상세</Typography>
                        <Box>
                            <DataTable headers={tableLabels} rows={TabledataSets} tableRow='netProfit' />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}