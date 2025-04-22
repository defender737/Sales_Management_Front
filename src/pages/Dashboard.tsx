import React from 'react';
import { Box, Paper, Typography, FormControl, Select, MenuItem, InputLabel, ToggleButtonGroup, ToggleButton, } from '@mui/material';
import Grid from '@mui/material/Grid2'
import PageTitle from '../components/PageTitle';
import BarChart from '../components/chart/BarChart';
import LineChart from '../components/chart/LineChart';
import DataTable from '../components/chart/dataTable';
import DoughnutChart from '../components/chart/DoughnutChart';

const pageTitle = {
    title: '대시보드',
    subTitle: '매출 및 지출 현황을 한눈에 확인할 수 있습니다.',
};

const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const income = [50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000];
const expenses = [30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000];

const calculateTotal = (data: number[]) => {
    return data.reduce((acc, curr) => acc + curr, 0);
}
const incomeWidthtotal  = [...income, calculateTotal(income)];
const expensesWidthtotal = [...expenses, calculateTotal(expenses)];

const tableLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월', "총계"];


const blue = 'rgba(54, 162, 235, 0.8)';
const red = 'rgba(255, 99, 132, 0.8)'

const dataSetsForBarChart = [
    { label: '수익', data: income, backgroundColor: blue },
    { label: '지출', data: expenses, backgroundColor: red },
]

const dataSets = [
    { label: '수익', data: income, borderColor: blue },
    { label: '지출', data: expenses, borderColor: red },
]

const TabledataSets = [
    { label: '수익', data: incomeWidthtotal, borderColor: blue },
    { label: '지출', data: expensesWidthtotal, borderColor: red },
]



const dataSetsForType = [
    { label: '배달', data: [12000, 15000, 17000, 14000, 16000, 18000, 0, 0, 0, 0, 0, 0], backgroundColor: 'rgba(75, 192, 192, 0.8)' },
    { label: '매장식사', data: [20000, 22000, 24000, 21000, 23000, 25000, 0, 0, 0, 0, 0, 0], backgroundColor: 'rgba(255, 205, 86, 0.8)' },
    { label: '포장', data: [8000, 9000, 10000, 9500, 11000, 12000, 0, 0, 0, 0, 0, 0], backgroundColor: 'rgba(255, 99, 132, 0.8)' },
  ];

  const TabledataSets2 = [
    { label: '배달', data: [...dataSetsForType[0].data, 0], borderColor: blue },
    { label: '포장', data: [...dataSetsForType[1].data, 0], borderColor: red },
    { label: '매장 식사', data: [...dataSetsForType[2].data, 0], borderColor: red },
]

  const dataSetsForTypeTrand = [
    { label: '배달', data: [12000, 15000, 17000, 14000, 16000, 18000], borderColor: 'rgba(75, 192, 192, 0.8)' },
  ];

export default function Dashboard(){
    return (
        <Box sx={{ mx: 'auto', maxWidth: { md: 200, lg: '100%' } }}>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
            <Box sx={{ display: 'flex', gap: 2 }}>
                <ToggleButtonGroup
                    //value={}
                    exclusive
                    //onChange={handleAlignment}
                    aria-label="text alignment"
                    sx={{ jestifyContent: 'center', mb: 2, display: "grid", gridAutoColumns: "1fr", gridAutoFlow: "column" }}
                >
                    <ToggleButton value="left" aria-label="left aligned">
                        연도별
                    </ToggleButton>
                    <ToggleButton value="center" aria-label="centered">
                        분기별
                    </ToggleButton>
                    <ToggleButton value="right" aria-label="right aligned">
                        월별
                    </ToggleButton>
                </ToggleButtonGroup>
                <FormControl sx={{ minWidth: 230, maxWidth: 500, mb: 2 }}>
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
                <FormControl sx={{ minWidth: 230, maxWidth: 500, mb: 2 }}>
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
                        <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }} >
                            <BarChart labels={labels} datasets={dataSetsForBarChart} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>연간 [수익] 변동</Typography>
                        <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                            <LineChart labels={labels} dataSets={dataSets} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>월별 수입/지출 상세</Typography>
                        <Box> 
                            <DataTable headers={tableLabels} rows={TabledataSets}/>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Box display="flex" flexDirection="column" gap={2} height="100%">
                        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
                            <Typography variant="h6" gutterBottom>유형별 매출 현황</Typography>
                            <Box sx={{ width: '100%', minHeight: 300, maxHeight: '100%' }}>
                                <BarChart labels={labels} datasets={dataSetsForType}  stacked={true}/>
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
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' , p : 2}}>
                            <DoughnutChart labels={['배달', '포장', '매장식사']} data = {[50, 30, 20]} backgroundColors = {['#FF6384', '#36A2EB', '#FFCE56']} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>매출 유형별 상세</Typography>
                        <Box> 
                            <DataTable headers={tableLabels} rows={TabledataSets2}/>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};