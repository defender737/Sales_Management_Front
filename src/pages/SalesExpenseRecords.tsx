import { useState, useEffect, useContext, useCallback } from 'react';
import { SalesRecord, getSalesRecordList } from '../types/types';
import { getSalesRecordsList } from '../api/api';
import { Container, Box, Tabs, Tab, TextField, IconButton, Button, Pagination, ToggleButtonGroup, ToggleButton, Collapse, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Table from '../components/Table';
import PageTitle from '../components/PageTitle';
import SelectSmall from '../components/SelectSmall';
import RecordForm from '../components/RecordForm'
import { SelectChangeEvent } from '@mui/material/Select';
import { useSelectedStore } from '../stores/useSelectedStore'
import { SnackbarContext } from '../contexts/SnackbarContext'
import { useApiRequest } from '../hooks/useApiRequest';
import { useFormModal } from '../stores/useFormModal';
import { utils } from '../utils/util'

// 테이블의 열 이름
const salesColumns = [
  { key: "no", label: "No.", width: "8%" },
  { key: "date", label: "날짜", width: "15%" },
  { key: "amount", label: "금액", width: "15%" },
  { key: "type", label: "구분", width: "15%" },
  { key: "description", label: "상세", width: "auto" },
  { key: "payment", label: "결제 수단", width: "15%" },
  { key: "etc", label: "비고", width: "15%" },
];

// 페이지 제목
const pageTitle = {
  title: "매출 / 지출 기록",
  subTitle: "매출 및 지출을 기록하고 조회합니다.",
}
// 정렬 방식
const selectOptions = [
  { value: 'desc', label: '최신순' },
  { value: 'asc', label: '과거순' },
]

export default function SalesExpenseRecords() {
  const [typeValue, setTypeValue] = useState('all'); // 탭 값 상태 생성
  const [data, setData] = useState<SalesRecord[]>([]); // 기록 데이터를 저장할 상태 생성
  const [page, setPage] = useState(1); // 페이지 상태 생성
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태 생성
  const [sortOrder, setSortOrder] = useState('desc'); // 정렬 상태 추가
  const [toggleValue, setToggleValue] = useState("all"); // 토글 버튼 값 상태 생성
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { selectedStoreId } = useSelectedStore();
  const { open: openForm, close: closeForm } = useFormModal();
  const showSnackbar = useContext(SnackbarContext);

  const { request, loading: isLoading} =
    useApiRequest(
      (data: getSalesRecordList) => getSalesRecordsList(data),
      (response) => {
        const totalEl = response.data.totalElements;
        const content = response.data.content;
        const indexedData = content.map((item: SalesRecord, index: number) => {
          const indexFromTop = (page - 1) * 10 + index;
          const rowNumber = sortOrder === 'desc' ? totalEl - indexFromTop : indexFromTop + 1;
          return { ...item, no: rowNumber };
        });
        setData(indexedData);
        setTotalPages(response.data.totalPages);
      },
      (msg) => showSnackbar("기록 리스트를 가져오지 못했습니다.", "error")
    )

  const getRequest = useCallback(() => {
    if (typeof selectedStoreId === 'number' && selectedStoreId > 0) {
      request({
        storeId: selectedStoreId,
        page: page - 1,
        size: 10,
        order: sortOrder,
        type: typeValue,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
      });
    }
  }, [selectedStoreId, page, sortOrder, typeValue, startDate, endDate, refreshTrigger]);

  useEffect(() => {
    getRequest();
  }, [getRequest]);

  const openRecordFormModal = (mode: 'create' | 'edit', rowId?: number) => {
    openForm({
      title: mode === 'create' ? '기록 추가하기' : '기록 수정하기',
      formComponent: (
        <RecordForm
          mode={mode}
          rowId={rowId}
          handleSubbmitAndClose={() => {
            closeForm();
            setPage(1);
            setRefreshTrigger(prev => prev + 1);
          }}
        />
      )
    });
  };

  const handleOpen = () => openRecordFormModal('create');
  const handleRowClick = (id: number) => openRecordFormModal('edit', id);

  // 탭 변경 이벤트 핸들러
  const handleTypeTabChange = (event: React.SyntheticEvent, value: string) => {
    setTypeValue(value);
  };
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
          <Tabs value={typeValue} onChange={handleTypeTabChange} aria-label="tab">
            <Tab value={"all"} label="전체" />
            <Tab value={"sales"} label="매출" />
            <Tab value={'expenses'} label="지출" />
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
            <Table data={data} columns={salesColumns} keyExtractor={(item) => item.id} onRowClick={handleRowClick} />
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