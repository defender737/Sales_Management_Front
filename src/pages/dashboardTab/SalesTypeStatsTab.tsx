import { useState, useEffect, useContext } from 'react';
import { useApiRequest } from '../../hooks/useApiRequest';
import { getSalesTypeStatsMonthly, getSalesTypeStatsDaily } from '../../api/api';
import { useSelectedStore } from '../../stores/useSelectedStore';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'

import BarChart from '../../components/chart/BarChart';
import LineChart from '../../components/chart/LineChart';
import DoughnutChart from '../../components/chart/DoughnutChart';
import DataTable from '../../components/chart/DataTable';

interface SalesTypeStatsTab {
    year: string;
    isExcludeDeliveryCommission : boolean;
    month : string;
    viewMode : string;
}

const chartColor = {
    delivery : 'rgba(255, 99, 132, 0.8)',
    pickup : 'rgba(75, 192, 192, 0.8)',
    hall : 'rgba(255, 205, 86, 0.8)'
}
export default function SalesTypeStatsTab({year, month, isExcludeDeliveryCommission, viewMode}: SalesTypeStatsTab) {
    const { selectedStoreId } = useSelectedStore();
    const showSnackbar = useContext(SnackbarContext);

    const [summaryData, setSummaryData] = useState<{
        labels: string[];
        hall: number[];
        pickup: number[];
        delivery: number[];
        tableLabels: string[];
        hallWithTotal: number[];
        pickupWithTotal: number[];
        deliveryWithTotal: number[];
    }>({
        labels: [],
        hall: [],
        pickup: [],
        delivery: [],
        tableLabels: [],
        hallWithTotal: [],
        pickupWithTotal: [],
        deliveryWithTotal: [],
    });

    const transformData = (hallMap: any, pickupMap: any, deliveryMap: any) => {
        const labels = Object.keys(hallMap); 
        const withTotal = labels.map((label) => ({
            label,
            hall: hallMap[label] ?? 0,
            pickup: pickupMap[label] ?? 0,
            delivery: deliveryMap[label] ?? 0,
        }));
        const withoutTotal = withTotal.filter((d) => d.label !== "총계");

        return {
            labels: withoutTotal.map((d) => d.label),
            hall: withoutTotal.map((d) => d.hall),
            pickup: withoutTotal.map((d) => d.pickup),
            delivery: withoutTotal.map((d) => d.delivery),
            hallWithTotal: withTotal.map((d) => d.hall),
            pickupWithTotal: withTotal.map((d) => d.pickup),
            deliveryWithTotal: withTotal.map((d) => d.delivery),
            tableLabels: withTotal.map((d) => d.label),
        };
    };

    const { request } = useApiRequest(
        (storeId: number, year: string, month : string, isExcludeDeliveryCommission : boolean) => 
            viewMode === 'monthly'
        ?
            getSalesTypeStatsMonthly(storeId, year, isExcludeDeliveryCommission)
            :
            getSalesTypeStatsDaily(storeId, year, month, isExcludeDeliveryCommission)
            ,
        (response) => {
            console.log(response.data)
            const hallMap = response.data.hallSummary || {};
            const pickupMap = response.data.pickupSummary || {};
            const deliveryMap = response.data.deliverySummary || {};
            setSummaryData(transformData(hallMap, pickupMap, deliveryMap));
        },
        (msg) => showSnackbar(msg, "error")
    );

    useEffect(() => {
        if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
        request(selectedStoreId, year, month, isExcludeDeliveryCommission);
    }, [selectedStoreId, year, month, isExcludeDeliveryCommission, viewMode]);
    
    const dataSetsForType = [
        { label: '배달', data: summaryData.delivery, backgroundColor: chartColor.delivery },
        { label: '매장식사', data: summaryData.hall, backgroundColor: chartColor.hall },
        { label: '포장', data: summaryData.pickup, backgroundColor: chartColor.pickup },
    ];

    const dataSetsForTypeTrand = [
        { label: '배달', data: summaryData.delivery, borderColor: chartColor.delivery},
        { label: '매장 식사', data: summaryData.hall, borderColor: chartColor.hall },
        { label: '포장', data: summaryData.pickup, borderColor: chartColor.pickup},
    ];

    const TabledataSets = [
        { label: '매장 식사', data: summaryData.hallWithTotal },
        { label: '포장', data: summaryData.pickupWithTotal },
        { label: '배달', data: summaryData.deliveryWithTotal },
    ];

    const dataSetsForDougnutChart =[
        { label: '배달', value: summaryData.deliveryWithTotal.find((_, i) => summaryData.tableLabels[i] === '총계') || 0, color: chartColor.delivery },
        { label: '포장', value: summaryData.pickupWithTotal.find((_, i) => summaryData.tableLabels[i] === '총계') || 0, color: chartColor.pickup },
        { label: '매장식사', value: summaryData.hallWithTotal.find((_, i) => summaryData.tableLabels[i] === '총계') || 0, color: chartColor.hall },
    ]

    return (
        <>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box display="flex" flexDirection="column" gap={2} height="100%">
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>유형별 매출 현황</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <BarChart labels={summaryData.labels} datasets={dataSetsForType} stacked={true} />
                            </Box>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>매출 유형별 트렌드</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <LineChart labels={summaryData.labels} dataSets={dataSetsForTypeTrand} />
                            </Box>
                        </Paper>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>매출 유형 비율</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
                            <DoughnutChart dataItems={dataSetsForDougnutChart} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>매출 유형별 상세</Typography>
                        <Box>
                            <DataTable headers={summaryData.tableLabels} rows={TabledataSets} tableRow='total'/>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}