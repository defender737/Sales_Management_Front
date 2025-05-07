import { useState, useEffect, useContext } from 'react';
import { useApiRequest } from '../../hooks/useApiRequest';
import { getSalesTypeStatsByDeliveryPlatformMonthly, getSalesTypeStatsByDeliveryPlatformDaily } from '../../api/api';
import { useSelectedStore } from '../../stores/useSelectedStore';
import { SnackbarContext } from '../../contexts/SnackbarContext';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'

import BarChart from '../../components/chart/BarChart';
import LineChart from '../../components/chart/LineChart';
import DoughnutChart from '../../components/chart/DoughnutChart';
import DataTable from '../../components/chart/dataTable';

interface DeliveryPlatformStatsTab {
    year: string;
    isExcludeDeliveryCommission : boolean;
    month : string;
    viewMode : string;
}

const platformName = {
    'baemin': '배달의 민족',
    'baemin1': '배민1',
    'coupangEats': '쿠팡이츠',
    'yogiyo': '요기요',
    'ddangyo': '땡겨요',
    'brand': '브랜드 플랫폼',
}

const platformColors = {
    baemin: '#2AC1BC',
    baemin1: '#0288D1',
    coupangEats: '#178EFE', 
    yogiyo: '#FA0050',
    ddangyo: '#F83A17',
    brand: '#81C784',
  };

export default function DeliveryPlatformStatsTab({year, month, viewMode, isExcludeDeliveryCommission}: DeliveryPlatformStatsTab) {
    const { selectedStoreId } = useSelectedStore();
    const showSnackbar = useContext(SnackbarContext);

    const [summaryData, setSummaryData] = useState<{
        labels: string[];
        tableLabels: string[];
        platformSummaries: Record<string, number[]>;
        platformTotals: Record<string, number>;
    }>({
        labels: [],
        tableLabels: [],
        platformSummaries: {},
        platformTotals: {},
    });

    const transformData = (summary: any) => {
        const monthLabels = Object.keys(summary.baeminSummary).filter(k => k !== '총계');
        const getValues = (map: any) => monthLabels.map((m: string) => map[m] ?? 0);

        const platforms = Object.keys(summary);
        const summaryData: Record<string, number[]> = {};
        const totalData: Record<string, number> = {};

        for (const key of platforms) {
            const platformKey = key.replace('Summary', '');
            summaryData[platformKey] = getValues(summary[key]);
            totalData[platformKey] = summary[key]['총계'] ?? 0;
        }

        return {
            labels: monthLabels,
            tableLabels: [...monthLabels, '총계'],
            platformSummaries: summaryData,
            platformTotals: totalData,
        };
    };

    const { request } = useApiRequest(
        (storeId: number, year: string, month : string, isExcludeDeliveryCommission : boolean) => 
            viewMode === 'monthly' ?
                getSalesTypeStatsByDeliveryPlatformMonthly(storeId, year, isExcludeDeliveryCommission)
            :
                getSalesTypeStatsByDeliveryPlatformDaily(storeId, year, month, isExcludeDeliveryCommission)
            ,
        (response) => {
            console.log(response)
            setSummaryData(transformData(response.data));
        },
        (msg) => showSnackbar(msg, "error")
    );

    useEffect(() => {
        if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
        request(selectedStoreId, year, month, isExcludeDeliveryCommission);
    }, [selectedStoreId, year, month, isExcludeDeliveryCommission, viewMode]);
    
    const barChartData = Object.keys(summaryData.platformSummaries).map((key) => ({
        label: platformName[key as keyof typeof platformName],
        data: summaryData.platformSummaries[key],
        backgroundColor: platformColors[key as keyof typeof platformColors],
    }));

    const lineChartData = Object.keys(summaryData.platformSummaries).map((key) => ({
        label: platformName[key as keyof typeof platformName],
        data: summaryData.platformSummaries[key],
        borderColor: platformColors[key as keyof typeof platformColors],
    }));

    const doughnutKeys = Object.keys(summaryData.platformTotals);

    const tableRows = Object.keys(summaryData.platformSummaries).map((key) => ({
        label: platformName[key as keyof typeof platformName],
        data: [...summaryData.platformSummaries[key], summaryData.platformTotals[key]],
        borderColor: platformColors[key as keyof typeof platformColors],
    }));

    return (
        <>
            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box display="flex" flexDirection="column" gap={2} height="100%">
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>플랫폼별 매출 현황</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <BarChart labels={summaryData.labels} datasets={barChartData} stacked={true} />
                            </Box>
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>플랫폼별 매출 트렌드</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <LineChart labels={summaryData.labels} dataSets={lineChartData} />
                            </Box>
                        </Paper>
                    </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>플랫폼별 매출 비율</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
                            <DoughnutChart
                                dataItems={doughnutKeys.map((key) => ({
                                    label: platformName[key as keyof typeof platformName] || key,
                                    value: summaryData.platformTotals[key],
                                    color: platformColors[key as keyof typeof platformColors],
                                }))}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>매출 유형별 상세</Typography>
                        <Box>
                            <DataTable headers={summaryData.tableLabels} rows={tableRows} tableRow='total'/>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}