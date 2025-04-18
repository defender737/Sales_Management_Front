import {useState, useContext} from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useForm, Controller } from 'react-hook-form';
import { updatePassword } from '../api/api'
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useApiRequest } from '../hooks/useApiRequest';
import axios from 'axios';

interface UpdatePassword {
  handleClose : () => void
}

export default function UpdatePasswordForm ({ handleClose }: UpdatePassword){

  const {control, handleSubmit, getValues, setError} = useForm();
  const showSnackbar = useContext(SnackbarContext);
  const {request : changePasswordRequest, loading, success} = useApiRequest(
    (currentPassword : string, newPassword : string) => updatePassword({currentPassword, newPassword}),
    () => {
      showSnackbar("비밀번호를 변경하였습니다.", "success");
      setTimeout(() => handleClose(), 1500);
    },
    (msg) => showSnackbar(msg, "error"),
    {delay : true}
  )

  const onSubmit = () => {
    const {currentPassword,newPassword, newPasswordConfirm} = getValues();
    if(newPassword !== newPasswordConfirm){
      setError("newPasswordConfirm", {
        type : "manual",
        message : "새 비밀번호와 일치하지 않습니다."
      });
      return;
    }
    if(currentPassword === newPassword){
      setError("newPassword", {
        type : "manual",
        message : "현재 비밀번호와 동일합니다."
      })
      return;
    }
    changePasswordRequest(currentPassword, newPassword);
  }

  return (
    <Box 
     component="form"
     onSubmit={handleSubmit(onSubmit)}
     sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 350 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>현재 비밀번호</Typography>
        <Controller
          name='currentPassword'
          control={control}
          defaultValue=""
          rules={{required : "현재 비밀번호 입력은 필수입니다"}}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{width : '100%'}}
              type='password'
            />
          )}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>새 비밀번호</Typography>
        <Controller
          name='newPassword'
          control={control}
          defaultValue=""
          rules={{required : "새 비밀번호 입력은 필수입니다"}}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{width : '100%'}}
              type='password'
            />
          )}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>새 비밀번호 확인</Typography>
        <Controller
          name='newPasswordConfirm'
          control={control}
          defaultValue=""
          rules={{required : "새 비밀번호 확인 입력은 필수입니다"}}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              sx={{width : '100%'}}
              type='password'
            />
          )}
        />
      </Box>
      <Box sx={{ alignSelf: 'flex-end', mt: 2 }}>
        <Button type="submit" disabled={loading} variant="contained" color="primary" sx={{ minHeight: 40, minWidth: 100 }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : success ? <CheckIcon /> : "확인"}
        </Button>
      </Box>
    </Box>
  );
};