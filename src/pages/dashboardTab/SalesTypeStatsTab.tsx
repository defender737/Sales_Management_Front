import { useState, useEffect, useContext } from 'react';
import { useApiRequest } from '../../hooks/useApiRequest';
import { getSalesTypeStats } from '../../api/api';
import { useSelectedStore } from '../../stores/useSelectedStore';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'

import BarChart from '../../components/chart/BarChart';
import LineChart from '../../components/chart/LineChart';
import DoughnutChart from '../../components/chart/DoughnutChart';
import DataTable from '../../components/chart/dataTable';

interface SalesTypeStatsTab {
    year: string;
    isExcludeDeliveryFee : boolean;
}

const blue = 'rgba(54, 162, 235, 0.8)';
const red = 'rgba(255, 99, 132, 0.8)'

export default function SalesTypeStatsTab({year, isExcludeDeliveryFee}: SalesTypeStatsTab) {
    const { selectedStoreId } = useSelectedStore();
    const showSnackbar = useContext(SnackbarContext);

    const [hallData, setHallData] = useState<number[]>([]);
    const [pickupData, setPickupData] = useState<number[]>([]);
    const [deliveryData, setDeliveryData] = useState<number[]>([]);
    const [hallTotal, setHallTotal] = useState(0);
    const [pickupTotal, setPickupTotal] = useState(0);
    const [deliveryTotal, setDeliveryTotal] = useState(0);
    const [labels, setLabels] = useState<string[]>([]); 
    const [tableLabels, setTableLabels] = useState<string[]>([]);

    const { request, loading } = useApiRequest(
        (storeId: number, year: string, isExcludeDeliveryFee : boolean) => getSalesTypeStats(storeId, year, isExcludeDeliveryFee),
        (response) => {
            console.log(response.data);
            const hallMap = response.data.hallSummary || {};
            const pickupMap = response.data.pickupSummary || {};
            const deliveryMap = response.data.deliverySummary || {};
            const monthLabels = Object.keys(hallMap).filter(k => k !== '총계');
            const getValues = (map: any) => monthLabels.map(m => map[m] ?? 0);

            setHallData(getValues(hallMap));
            setPickupData(getValues(pickupMap));
            setDeliveryData(getValues(deliveryMap));

            setHallTotal(hallMap['총계'] ?? 0);
            setPickupTotal(pickupMap['총계'] ?? 0);
            setDeliveryTotal(deliveryMap['총계'] ?? 0);

            setLabels(monthLabels);
            setTableLabels([...monthLabels, '총계']);
        },
        (msg) => showSnackbar(msg, "error")
    );

    useEffect(() => {
        if (!selectedStoreId) return showSnackbar("메장 정보를 찾을 수 없습니다.", "error");
        request(selectedStoreId, year, isExcludeDeliveryFee);
    }, [selectedStoreId, year, isExcludeDeliveryFee]);
    
    const dataSetsForType = [
        { label: '배달', data: deliveryData, backgroundColor: 'rgba(75, 192, 192, 0.8)' },
        { label: '매장식사', data: hallData, backgroundColor: 'rgba(255, 205, 86, 0.8)' },
        { label: '포장', data: pickupData, backgroundColor: 'rgba(255, 99, 132, 0.8)' },
    ];

    const dataSetsForTypeTrand = [
        { label: '배달', data: deliveryData, borderColor: 'rgba(75, 192, 192, 0.8)' },
        { label: '포장', data: pickupData, borderColor: 'rgba(255, 99, 132, 0.8)' },
        { label: '매장 식사', data: hallData, borderColor: 'rgba(255, 205, 86, 0.8)' },
    ];

    const TabledataSets = [
        { label: '매장 식사', data: [...hallData, hallTotal], borderColor: red },
        { label: '포장', data: [...pickupData, pickupTotal], borderColor: red },
        { label: '배달', data: [...deliveryData, deliveryTotal], borderColor: blue },
    ];

    return (
        <>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box display="flex" flexDirection="column" gap={2} height="100%">
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>유형별 매출 현황</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <BarChart labels={labels} datasets={dataSetsForType} stacked={true} />
                            </Box>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>매출 유형별 트렌드</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <LineChart labels={labels} dataSets={dataSetsForTypeTrand} />
                            </Box>
                        </Paper>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>매출 유형 비율</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
                            <DoughnutChart labels={['배달', '포장', '매장식사']} data={[deliveryTotal, pickupTotal, hallTotal]} backgroundColors={['#FF6384', '#36A2EB', '#FFCE56']} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>매출 유형별 상세</Typography>
                        <Box>
                            <DataTable headers={tableLabels} rows={TabledataSets} tableRow='total'/>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}