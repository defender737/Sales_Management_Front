import { useEffect, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  Chip,
  Typography,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from '@mui/material';
import { createSalesRecord, getSalesRecords, updateSalesRecord, deleteSalesRecord } from '../api/api'
import { SalesRecordForm } from '../types/types'
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useSelectedStore } from '../stores/useSelectedStore'
import { useApiRequest } from '../hooks/useApiRequest';
import { utils } from '../utils/util'
import CheckIcon from '@mui/icons-material/Check';

interface RecordFormProps {
  mode: 'create' | 'edit'
  rowId?: number
  handleSubbmitAndClose: () => void;
}

export default function RecordForm({ mode, handleSubbmitAndClose, rowId }: RecordFormProps) {
  const isEdit = mode === 'edit';
  const showSnackbar = useContext(SnackbarContext)
  const { selectedStoreId } = useSelectedStore();
  const { register, handleSubmit, control, setValue, getValues, reset } = useForm<SalesRecordForm>({
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'SALES',
      description: '',
      payment: 'ETC',
      etc: '',
    },
  });

  const { request: createRequest, loading: createLoading, success: createSuccess, reset: createReset } =
    useApiRequest(
      (storeId: number, form: SalesRecordForm) => createSalesRecord(storeId, form),
      () => {
        showSnackbar("기록을 추가했습니다.", "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: updateRequest, loading: updateLoading, success: updateSuccess, reset: updateReset } =
    useApiRequest(
      (rowId: number, form: SalesRecordForm) => updateSalesRecord(rowId, form),
      () => {
        showSnackbar("기록을 수정했습니다.", "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: deleteRequest, loading: deleteLoading, success: deleteSuccess, reset: deleteeReset } =
    useApiRequest(
      (rowId: number) => deleteSalesRecord(rowId),
      () => {
        showSnackbar("기록을 삭제했습니다.", "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: getRequest, reset: getReset } =
    useApiRequest(
      (rowId: number) => getSalesRecords(rowId),
      (response) => {
        reset({
          amount: response.data.amount,
          date: response.data.date,
          type: response.data.type === "매출" ? "SALES" : "EXPENSES",
          description: response.data.description,
          payment:
            response.data.payment === "카드" ? "CARD"
              :
              response.data.payment === "현금" ? "CASH"
                :
                "ETC",
          etc: response.data.etc,
        });
      },
      (msg) => showSnackbar("기록 정보를 가져오지 못했습니다.", "error")
    )

  useEffect(() => {
    if (typeof rowId === 'number' && isEdit) {
      getRequest(rowId);
    }
  }, [isEdit, rowId]);

  const onCreate = (data: SalesRecordForm) => {
    if (!selectedStoreId) return showSnackbar("메장 정보를 찾을 수 없습니다.", "error");
    createRequest(selectedStoreId, data);
  };

  const onUpdate = (data: SalesRecordForm) => {
    if (!rowId) return showSnackbar("기록 정보를 찾을 수 없습니다.", "error");
    updateRequest(rowId, data);
  };

  const onDelete = async () => {
    if (!rowId) return showSnackbar("기록 정보를 찾을 수 없습니다.", "error");
    deleteRequest(rowId);
  };

  const handleAddAmount = (value: number) => {
    setValue('amount', getValues('amount') + value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(isEdit ? onUpdate : onCreate)} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 800 }}>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>날짜</Typography>
          <TextField
            type="date"
            {...register('date')}
            fullWidth
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>구분</Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              row
              {...register('type')}
            >
              <FormControlLabel value="SALES" control={<Radio />} label="매출" />
              <FormControlLabel value="EXPENSES" control={<Radio />} label="지출" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>금액</Typography>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={utils.formatNumberWithCommas(field.value)}
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
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>금액 빠르게 추가</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            {[1000000, 100000, 10000, 1000, 100].map((unit) => (
              <Chip
                key={unit}
                label={`${unit.toLocaleString()}원`}
                onClick={() => handleAddAmount(unit)}
                clickable
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>결제 수단</Typography>
          <FormControl required fullWidth>
            <Controller
              name="payment"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                >
                  <MenuItem value="CARD">카드</MenuItem>
                  <MenuItem value="CASH">현금</MenuItem>
                  <MenuItem value="ETC">기타</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>상세</Typography>
        <TextField
          {...register('description')}
          multiline
          rows={2}
          fullWidth
        />
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
  );
};
