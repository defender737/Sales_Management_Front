import React from 'react';
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
    SelectChangeEvent,
    CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {createSalesRecord, getSalesRecords, editSalesRecord, deleteSalesRecord} from '../api/api'
import {SalesRecordForm} from '../types/types'
import { SnackbarContext } from '../contexts/SnackbarContext';
import {snackMessages} from '../constants/messages'
import axios from 'axios';

// 금액에 콤마 추가
const formatNumberWithCommas = (value: number) => {
 
  const number = Number(value.toString().replace(/,/g, ''));
  return isNaN(number) ? '' : number.toLocaleString();
};

interface RecordFormProps {
    mode : 'create' | 'edit'
    rowId? : number
    handleSubbmitAndClose: () => void;
  }

// 서버에 요청할 폼 구성
const RecordAddForm = ({mode, handleSubbmitAndClose, rowId} : RecordFormProps) => {

    const isEdit = mode === 'edit';

    const [formData, setFormData] = React.useState<SalesRecordForm>({
        storeId : 1,
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'SALES',
        description: '',
        payment: 'ETC',
        etc: '',
    });
    const [createLoading, setCreateLoading] = React.useState(false);
    const [editLoading, setEditLoading] = React.useState(false);
    const [deleteLoading, setDeleteLoading] = React.useState(false);
    const [createSuccess, setCreateSuccess] = React.useState(false);
    const [editSuccess, setEditSuccess] = React.useState(false);
    const [deleteSuccess, setDeleteSuccess] = React.useState(false);
    const showSnackbar = React.useContext(SnackbarContext)

    React.useEffect(() => {
        const record = async () => {
          if (isEdit && rowId !== undefined) {
            try {
              const response = await getSalesRecords(rowId);
              setFormData({
                storeId: response.data.storeId,
                amount: response.data.amount,
                date: response.data.date,
                type: response.data.type === "매출" ? "SALES" : "EXPENSES",
                description: response.data.description,
                payment:
                response.data.payment === "카드" ? "CARD" :
                response.data.payment === "현금" ? "CASH" :
                "ETC",
                etc: response.data.etc,
              });
            console.log(response)
            } catch (error) {
              console.error("데이터 로딩 실패:", error);
              showSnackbar(snackMessages.get.error('데이터'), "error");
            }
          }
        };
  
        record();
      }, [isEdit, rowId]);
  

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> |
         React.ChangeEvent<{ name?: string; value: unknown }> |
         SelectChangeEvent
    ) => {
      const { name, value } = event.target;
      if (name) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    // 금액 빠르게 추가
    const handleAddAmount = (value: number) => {
        setFormData((prev) => ({
            ...prev,
            amount: Number(prev.amount || 0) + value,
        }));
    };

    const minDelay = 500;

    const handleCreate = async () => {

        const startTime = Date.now();
        setCreateLoading(true);
        try {
          const response = await createSalesRecord(formData);
          console.log('생성 성공:', response);

          const elapsed = Date.now() - startTime;
          const delay = Math.max(0, minDelay - elapsed);

          setCreateSuccess(true);
           setTimeout(() => {
            setCreateLoading(false);
            setCreateSuccess(true);
            showSnackbar(snackMessages.create.success('기록'), "success");
            setTimeout(() => handleSubbmitAndClose(), 1500);
          }, delay);
        } catch (error) {
          console.error('생성 실패:', error);
          showSnackbar(snackMessages.create.error('기록'), "error");
          setCreateSuccess(false);
          setCreateLoading(false);
        }
      };
      
      const handleUpdate = async () => {
        if (!rowId) return;
      
        const startTime = Date.now();
        setEditLoading(true);
      
        try {
          const response = await editSalesRecord(rowId, formData);
          console.log('수정 성공:', response);
      
          const elapsed = Date.now() - startTime;
          const delay = Math.max(0, minDelay - elapsed);
      
          setTimeout(() => {
            setEditLoading(false);
            setEditSuccess(true);
            showSnackbar(snackMessages.edit.success('기록'), "success");
            setTimeout(() => handleSubbmitAndClose(), 1500);
          }, delay);
        } catch (error) {
          if(axios.isAxiosError(error)){
            console.error('수정 실패:', error);
            let message = error.response?.data.details;
            showSnackbar(message, "error");
            setEditLoading(false);
            setEditSuccess(false);
          }
        }
      };
      
      const handleDelete = async () => {
        if (!rowId) return;

        const startTime = Date.now();
        setDeleteLoading(true);
        try {
          const response = await deleteSalesRecord(rowId);
          console.log('삭제 성공:', response);
          setDeleteSuccess(true);

          const elapsed = Date.now() - startTime;
          const delay = Math.max(0, minDelay - elapsed);
          
          setTimeout(() => {
            setDeleteLoading(false);
            setDeleteSuccess(true);
            showSnackbar(snackMessages.delete.success('기록'), "success");
            setTimeout(() => handleSubbmitAndClose(), 1500);
          }, delay);
        } catch (error) {
          if(axios.isAxiosError(error)){
            console.error('삭제 실패:', error);
            let message = error.response?.data.details;
            showSnackbar(message, "error");
            setDeleteSuccess(false);
            setDeleteLoading(false);
          }
        }
      };

    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, width : 800 }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>날짜</Typography>
                    <TextField
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>구분</Typography>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            row
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
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
                    <TextField
                        type="text"
                        name="amount"
                        sx={{mb : 1}}
                        value={formatNumberWithCommas(formData.amount)}
                        onChange={(e) => {
                            const raw = e.target.value.replace(/,/g, '');
                            if (!/^\d*$/.test(raw)) return;
                            setFormData((prev) => ({
                                ...prev,
                                amount: Number(raw),
                            }));
                        }}
                        onBlur={(e) => {
                            const raw = e.target.value.replace(/,/g, '');
                            setFormData((prev) => ({
                                ...prev,
                                amount: Number(raw),
                            }));
                        }}
                        required
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">원</InputAdornment>,
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5}}>금액 빠르게 추가</Typography>
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
                        <Select
                            name="payment"
                            value={formData.payment}
                            onChange={handleChange}
                        >
                            <MenuItem value="CARD">카드</MenuItem>
                            <MenuItem value="CASH">현금</MenuItem>
                            <MenuItem value="ETC">기타</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>상세</Typography>
                <TextField
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    fullWidth
                />
            </Box>

            <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>비고</Typography>
                <TextField
                    name="etc"
                    value={formData.etc}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    fullWidth
                />
            </Box>
            {
                isEdit && rowId !== undefined
                ?
                <Box sx={{alignSelf: 'flex-end', mt : 2}}>
                    <Button type="submit" disabled={deleteLoading || editLoading} variant="contained" color="error" onClick={handleDelete} sx={{ minHeight: 40, minWidth: 100 ,mr : 2}}>
                        {deleteLoading ? <CircularProgress size={25} color="inherit" /> : deleteSuccess ? <CheckIcon /> : "삭제"}
                    </Button>
                    <Button type="submit" disabled={deleteLoading || editLoading} variant="contained" color="info" onClick={handleUpdate} sx={{ minHeight: 40, minWidth: 100 }}>
                        {editLoading ? <CircularProgress size={25} color="inherit" /> : editSuccess ? <CheckIcon /> : "수정"}
                    </Button>
                </Box>
                :
                <Box sx={{alignSelf: 'flex-end', mt : 2}}>
                    <Button type="submit" disabled={createLoading} variant="contained" color="primary" onClick={handleCreate} sx={{ minHeight: 40, minWidth: 100 }}>
                        {createLoading ? <CircularProgress size={20} color="inherit" /> : createSuccess ? <CheckIcon /> : "추가"}
                    </Button>
                </Box>
            }
        </Box>
    );
};

export default RecordAddForm;
