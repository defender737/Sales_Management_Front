import { useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Divider,
} from '@mui/material';
import { createSalesRecord, updateSalesRecord, deleteSalesRecord, getSalesRecord } from '../api/api'
import { SalesRecordFormRequest } from '../types/types'
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useSelectedStore } from '../stores/useSelectedStore'
import { useApiRequest } from '../hooks/useApiRequest';
import { utils } from '../utils/util'
import CheckIcon from '@mui/icons-material/Check';
import { Global } from '@emotion/react';


interface RecordFormProps {
  mode: 'create' | 'edit'
  rowId?: number
  handleSubbmitAndClose: () => void;
}


const salesFields = [
  { name: 'baemin', label: '배민' },
  { name: 'baemin1', label: '배민1' },
  { name: 'coupangEats', label: '쿠팡이츠' },
  { name: 'yogiyo', label: '요기요' },
  { name: 'ddangyo', label: '땡겨요' },
  { name: 'brandDelivery', label: '브랜드 자체 배달' },
  { name: 'takeout', label: '포장 매출' },
  { name: 'hall', label: '홀 매출' },
] as const;

export default function SalesRecordForm({ mode, handleSubbmitAndClose, rowId }: RecordFormProps) {
  const isEdit = mode === 'edit';
  const showSnackbar = useContext(SnackbarContext)
  const { selectedStoreId } = useSelectedStore();
  const { register, handleSubmit, control, reset, watch } = useForm({
    defaultValues: {
      baemin: 0,
      baemin1: 0,
      coupangEats: 0,
      yogiyo: 0,
      ddangyo: 0,
      brandDelivery: 0,
      takeout: 0,
      hall: 0,
      date: new Date().toISOString().split('T')[0],
      etc: '',
    },
  });

  const { request: createRequest, loading: createLoading, success: createSuccess} =
    useApiRequest(
      (storeId: number, form: SalesRecordFormRequest) => createSalesRecord(storeId, form),
      () => {
        showSnackbar("기록을 추가했습니다.", "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: updateRequest, loading: updateLoading, success: updateSuccess} =
    useApiRequest(
      (rowId: number, form: SalesRecordFormRequest) => updateSalesRecord(rowId, form),
      () => {
        showSnackbar("기록을 수정했습니다.", "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: deleteRequest, loading: deleteLoading, success: deleteSuccess} =
    useApiRequest(
      (rowId: number) => deleteSalesRecord(rowId),
      () => {
        showSnackbar("기록을 삭제했습니다.", "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: getRequest } =
    useApiRequest(
      (rowId: number) => getSalesRecord(rowId),
      (response) => {
        reset({
          baemin: response.data.baemin,
          baemin1: response.data.baemin1,
          coupangEats: response.data.coupangEats,
          yogiyo: response.data.yogiyo,
          ddangyo: response.data.ttaenggeoyo,
          brandDelivery: response.data.brandDelivery,
          takeout: response.data.takeout,
          hall: response.data.hall,
          date: response.data.date,
          etc: response.data.etc,
        });
      },
      (msg) => showSnackbar(msg, "error")
    )

  useEffect(() => {
    if (typeof rowId === 'number' && isEdit) {
      getRequest(rowId);
    }
  }, [isEdit, rowId]);

  const onCreate = (data: SalesRecordFormRequest) => {
    if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
    const payload = { ...data, totalSales };
    createRequest(selectedStoreId, payload);
  };

  const onUpdate = (data: SalesRecordFormRequest) => {
    if (!rowId) return showSnackbar("기록 정보를 찾을 수 없습니다.", "error");
    const payload = { ...data, totalSales };
    updateRequest(rowId, payload);
  };

  const onDelete = async () => {
    if (!rowId) return showSnackbar("기록 정보를 찾을 수 없습니다.", "error");
    deleteRequest(rowId);
  };

  const totalSales = watch(['baemin', 'baemin1', 'coupangEats', 'yogiyo', 'ddangyo', 'brandDelivery', 'takeout', 'hall'])
    .reduce((acc, cur) => acc + (Number(cur) || 0), 0);

  return (
    <>
          <Global
        styles={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      />
      
    <Box component="form" onSubmit={handleSubmit(isEdit ? onUpdate : onCreate)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 800 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>날짜</Typography>
        <TextField
          type="date"
          {...register('date')}
          fullWidth
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>배달 매출</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {salesFields.slice(0, 6).map((item) => (
          <Box key={item.name}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{item.label}</Typography>
            <Controller
              name={item.name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={utils.formatNumberWithCommas(field.value ?? 0)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    if (!/^\d*$/.test(raw)) return;
                    field.onChange(Number(raw));
                  }}
                  onBlur={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    field.onChange(Number(raw));
                  }}
                  InputProps={{ endAdornment: <InputAdornment position="end">원</InputAdornment> }}
                  fullWidth
                />
              )}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          배달 총 매출: {utils.formatNumberWithCommas(
            watch(['baemin', 'baemin1', 'coupangEats', 'yogiyo', 'ddangyo', 'brandDelivery'])
              .reduce((acc, cur) => acc + (Number(cur) || 0), 0)
          )}원
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>홀 / 포장 매출</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        {salesFields.slice(6, 8).map((item) => (
          <Box key={item.name}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{item.label}</Typography>
            <Controller
              name={item.name}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={utils.formatNumberWithCommas(field.value ?? 0)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    if (!/^\d*$/.test(raw)) return;
                    field.onChange(Number(raw));
                  }}
                  onBlur={(e) => {
                    const raw = e.target.value.replace(/,/g, '');
                    field.onChange(Number(raw));
                  }}
                  InputProps={{ endAdornment: <InputAdornment position="end">원</InputAdornment> }}
                  fullWidth
                />
              )}
            />
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" fontWeight={700}>총 매출: {utils.formatNumberWithCommas(totalSales)}원</Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>비고</Typography>
        <TextField
          {...register('etc')}
          multiline
          rows={2}
          fullWidth
        />
      </Box>
      {
        isEdit && rowId !== undefined
          ?
          <Box sx={{ alignSelf: 'flex-end', mt: 2 }}>
            <Button type="button" disabled={deleteLoading || updateLoading} variant="contained" color="error" onClick={onDelete} sx={{ minHeight: 40, minWidth: 100, mr: 2 }}>
              {deleteLoading ? <CircularProgress size={25} color="inherit" /> : deleteSuccess ? <CheckIcon /> : "삭제"}
            </Button>
            <Button type="submit" disabled={deleteLoading || updateLoading} variant="contained" color="primary" sx={{ minHeight: 40, minWidth: 100 }}>
              {updateLoading ? <CircularProgress size={25} color="inherit" /> : updateSuccess ? <CheckIcon /> : "수정"}
            </Button>
          </Box>
          :
          <Box sx={{ alignSelf: 'flex-end', mt: 2 }}>
            <Button type="submit" disabled={createLoading} variant="contained" color="primary" sx={{ minHeight: 40, minWidth: 100 }}>
              {createLoading ? <CircularProgress size={20} color="inherit" /> : createSuccess ? <CheckIcon /> : "추가"}
            </Button>
          </Box>
      }
      </Box>
      </>
  );
};
