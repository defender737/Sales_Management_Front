import { JSX, useCallback, useContext, useEffect, useState } from "react";
import { useSelectedStore } from '../stores/useSelectedStore'
import { Box, Button, CircularProgress, Container, IconButton, Pagination, Tab, Tabs, TextField, ToggleButton, ToggleButtonGroup, Collapse } from "@mui/material";
import { useApiRequest } from '../hooks/useApiRequest';
import { useFormModal } from '../stores/useFormModal';
import { SnackbarContext } from '../contexts/SnackbarContext'
import PageTitle from '../components/PageTitle';
import Table from '../components/Table';
import SelectSmall from '../components/SelectSmall';
import AddIcon from '@mui/icons-material/Add';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import { utils } from '../utils/util'



const selectOptions = [
    { value: 'desc', label: '최신순' },
    { value: 'asc', label: '과거순' },
]

interface RecordsProps<T, F> {
    pageTitle: { title: string; subTitle: string };
    columns: { key: string, label: string, width: string }[]
    requestApi: (filter: F) => Promise<any>;
    tabsOptions: { value: string; label: string }[];
    getFilterParams: () => F;  
    renderForm: (mode: 'create' | 'edit', rowId: number | undefined, close: () => void) => JSX.Element;
}

export default function Records<T extends { id: number }, F>({
    pageTitle,
    columns,
    requestApi,
    renderForm,
    tabsOptions,
    getFilterParams
}: RecordsProps<T, F>) {
    const [paymentValue, setPaymentValue] = useState('all');
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [toggleValue, setToggleValue] = useState('all');
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { selectedStoreId } = useSelectedStore();
    const { open: openForm, close: closeForm } = useFormModal();
    const showSnackbar = useContext(SnackbarContext);

    const { request, loading: isLoading } = useApiRequest(
        (filter: F) => requestApi(filter),
        (response) => {
            const totalEl = response.data.totalElements;
            const content = response.data.content;
            const indexedData = content.map((item: T, index: number) => {
                const indexFromTop = (page - 1) * 10 + index;
                const rowNumber = sortOrder === 'desc' ? totalEl - indexFromTop : indexFromTop + 1;
                return { ...item, no: rowNumber };
            });
            setData(indexedData);
            setTotalPages(response.data.totalPages);
        },
        (msg) => showSnackbar(msg, "error")
    );

    const getRequest = useCallback(() => {
        if (typeof selectedStoreId === 'number' && selectedStoreId > 0) {
            const filterParams = getFilterParams();
            request(filterParams);
        }
    }, [selectedStoreId, page, sortOrder, paymentValue, startDate, endDate, refreshTrigger]);

    useEffect(() => {
        getRequest();
    }, [getRequest]);

    const openRecordFormModal = (mode: 'create' | 'edit', rowId?: number) => {
        openForm({
            title: mode === 'create' ? '기록 추가하기' : '기록 수정하기',
            formComponent: renderForm(mode, rowId, () => {
                closeForm();
                setPage(1);
                setRefreshTrigger(prev => prev + 1);
            })
        });
    };

    const handleOpen = () => openRecordFormModal('create');
    const handleRowClick = (id: number) => openRecordFormModal('edit', id);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        setSortOrder(event.target.value);
        setPage(1); // 정렬 순서가 변경되면 페이지를 1로 초기화
    };

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        if (value !== null) {
            setToggleValue(value);
            setPage(1);
            const today = new Date(); // 오늘 날짜
            const endDate = today.toISOString().split('T')[0]; // 오늘 날짜를 yyyy-MM-dd 형식으로 변환

            if (value === "all") {
                setStartDate(null);
                setEndDate(null);
            } else if (value === "oneMonth") {
                const oneMonthAgo = new Date(today);
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                const startDate = oneMonthAgo.toISOString().split('T')[0];
                setStartDate(startDate);
                setEndDate(endDate);
            } else if (value === "threeMonth") {
                const threeMonthsAgo = new Date(today);
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                const startDate = threeMonthsAgo.toISOString().split('T')[0];
                setStartDate(startDate);
                setEndDate(endDate);
            }
        }
    };

    const handleDateSearchButtonClick = () => {
        const startInput = document.getElementById('startDate') as HTMLInputElement;
        const endInput = document.getElementById('endDate') as HTMLInputElement;
        if (startInput && endInput) {
            setStartDate(startInput.value);
            setEndDate(endInput.value);
            setPage(1); // 검색 시 페이지 초기화
        }
    }

    // 탭 변경 이벤트 핸들러
    const handleTypeTabChange = (event: React.SyntheticEvent, value: string) => {
        setPaymentValue(value);
    };

    return (
        <Box>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
            <Container sx={{
                borderRadius: "5px",
                p: 3,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                width: '100%',  // 화면 크기에 맞춰 유동적으로 크기 변화
                maxWidth: 'none !important', // 최대 너비를 100%로 설정
                minWidth: '320px', // 최소 너비 설정 (필요에 따라 조정)
            }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={paymentValue} onChange={handleTypeTabChange} aria-label="tab">
                        {
                            tabsOptions.map((option) => (
                                <Tab key={option.value} value={option.value} label={option.label} />
                            ))
                        }
                    </Tabs>
                </Box>
                <Box sx={{ mt: 3, ml: 1 }}>
                    <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", mr: 1 }}>
                        <Box display="flex" sx={{ alignItems: "center" }}>
                            <ToggleButtonGroup
                                color='primary'
                                value={toggleValue}
                                exclusive
                                onChange={handleToggleChange}
                                aria-label="text alignment"
                                sx={{ mr: 3, display: "grid", gridAutoColumns: "1fr", gridAutoFlow: "column", }}
                            >
                                <ToggleButton value={"all"} aria-label="left aligned">전체</ToggleButton>
                                <ToggleButton value={"oneMonth"} aria-label="centered">1 개월</ToggleButton>
                                <ToggleButton value={"threeMonth"} aria-label="right aligned">3 개월</ToggleButton>
                                <ToggleButton value={"selfInput"} aria-label="right aligned">직접 입력</ToggleButton>
                            </ToggleButtonGroup>
                            <Collapse in={toggleValue === "selfInput"} orientation="horizontal">
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", pt: 1, pb: 1 }}>
                                    <TextField id="startDate" InputLabelProps={{ shrink: true }} label="시작일" type="date" defaultValue={utils.getOneMonthAgoDate()} sx={{ mr: 2 }} />
                                    <TextField id="endDate" InputLabelProps={{ shrink: true }} label="종료일" type="date" defaultValue={utils.getTodayDate()} />

                                    <IconButton color="primary" aria-label="search" component="span" sx={{
                                        ml: 2,
                                        width: 40,
                                        height: 40,
                                        backgroundColor: 'primary.main',
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark', // hover시 색상 변화
                                        },
                                    }}
                                        onClick={handleDateSearchButtonClick}
                                    >
                                        <SearchIcon sx={{ color: "white" }} />
                                    </IconButton>
                                </Box>
                            </Collapse>
                        </Box>
                        <SelectSmall value={sortOrder} label="정렬" onChange={handleSelectChange} options={selectOptions} labelId='sort-order-label' id='sort-order-select' />
                    </Box>
                </Box>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Table data={data} columns={columns} keyExtractor={(item) => item.id} onRowClick={handleRowClick} />
                        <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                            <Button variant="contained" size="large" onClick={handleOpen} sx={{ ml: 2 }}><AddIcon sx={{ color: "white", mr: 1 }} />기록 추가하기</Button>
                        </Box>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                            sx={{ display: "flex", justifyContent: "center" }} />
                    </>
                )}
            </Container>
        </Box>
    );
}
