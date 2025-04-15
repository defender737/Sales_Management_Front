import React from 'react';
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
import axios from 'axios';

interface UpdatePasswordForm {
  handleClose : () => void
}
// 서버에 요청할 폼 구성
const UpdatePasswordForm = ({ handleClose }: UpdatePasswordForm) => {

  const {control, handleSubmit, getValues, setError} = useForm();
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const showSnackbar = React.useContext(SnackbarContext)
  const minDelay = 500;

  const onSubmit = async() => {
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

    const startTime = Date.now();
    setUpdateLoading(true);

    try{
      const response = await updatePassword({currentPassword, newPassword});
      console.log("비밀번호 수정 성공");

      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, minDelay - elapsed);

      setTimeout(() => {
        setUpdateLoading(false);
        setUpdateSuccess(true);
        showSnackbar("비밀번호를 변경하였습니다.", "success");
        setTimeout(() => handleClose(), 1500);
      }, delay)
    }catch (error){
      if(axios.isAxiosError(error)){
        const message = error.response?.data.details || "비밀번호 변경에 실패했습니다"
        showSnackbar(message, "error");
        setUpdateLoading(false);
        setUpdateSuccess(false);
      }
    }
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
        <Button type="submit" disabled={updateLoading} variant="contained" color="primary" sx={{ minHeight: 40, minWidth: 100 }}>
          {updateLoading ? <CircularProgress size={20} color="inherit" /> : updateSuccess ? <CheckIcon /> : "확인"}
        </Button>
      </Box>
    </Box>
  );
};

export default UpdatePasswordForm;
