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
  CircularProgress,
} from '@mui/material';
import { createExpenseRecord, getExpenseRecord, updateExpenseRecord, deleteExpenseRecord } from '../api/api'
import { ExpenseRecordFormRequest } from '../types/types'
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useSelectedStore } from '../stores/useSelectedStore'
import { useApiRequest } from '../hooks/useApiRequest';
import { utils } from '../utils/util'
import CheckIcon from '@mui/icons-material/Check';

enum ExpensesDetail {
  SALARY = '급여',
  MATERIAL = '재료비',
  MAINTENANCE = '관리비',
  RENT = '임대료',
  COMMUNICATION = '통신비',
  MEALS = '식비',
  ADVERTISING = '광고비',
  DELIVERY = '배송비',
  HVAC = '냉.난방비',
  ETC = '기타',
}

interface RecordFormProps {
  mode: 'create' | 'edit'
  rowId?: number
  handleSubbmitAndClose: () => void;
}

export default function ExpenseRecordForm({ mode, handleSubbmitAndClose, rowId }: RecordFormProps) {
  const isEdit = mode === 'edit';
  const showSnackbar = useContext(SnackbarContext)
  const { selectedStoreId } = useSelectedStore();
  const { register, handleSubmit, control, setValue, getValues, reset} = useForm<ExpenseRecordFormRequest>({
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      detail: '',
      payment: 'ETC',
      etc: '',
    },
  });

  const descriptionOptions = Object.entries(ExpensesDetail).map(([value, label]) => ({ value, label }));

  const { request: createRequest, loading: createLoading, success: createSuccess} =
    useApiRequest(
      (storeId: number, form: ExpenseRecordFormRequest) => createExpenseRecord(storeId, form),
      (response) => {
        showSnackbar(response.data, "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: updateRequest, loading: updateLoading, success: updateSuccess} =
    useApiRequest(
      (rowId: number, form: ExpenseRecordFormRequest) => updateExpenseRecord(rowId, form),
      (response) => {
        showSnackbar(response.data, "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: deleteRequest, loading: deleteLoading, success: deleteSuccess} =
    useApiRequest(
      (rowId: number) => deleteExpenseRecord(rowId),
      (response) => {
        showSnackbar(response.data, "success");
        setTimeout(() => handleSubbmitAndClose(), 1500);
      },
      (msg) => showSnackbar(msg, "error"),
      { delay: true }
    );

  const { request: getRequest } =
    useApiRequest(
      (rowId: number) => getExpenseRecord(rowId),
      (response) => {
        reset({
          amount: response.data.amount,
          date: response.data.date,
          detail : response.data.detail,
          payment:response.data.payment,
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

  const onCreate = (data: ExpenseRecordFormRequest) => {
    if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
    createRequest(selectedStoreId, data);
  };

  const onUpdate = (data: ExpenseRecordFormRequest) => {
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
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>날짜</Typography>
        <TextField
          type="date"
          {...register('date')}
          fullWidth
        />
      </Box>
      <Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>상세</Typography>
          <FormControl required fullWidth>
            <Controller
              name="detail"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  fullWidth
                >
                  {descriptionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
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
