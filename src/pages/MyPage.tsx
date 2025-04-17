import {
  Box,
  TextField,
  Typography,
  Container,
  Button,
  FormControl,
  Avatar,
  Divider,
  Switch
} from '@mui/material';
import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PageTitle from '../components/PageTitle'
import { updateUser, initUserData, updateEmailConsent } from '../api/api'
import axios from 'axios';
import { SnackbarContext } from '../contexts/SnackbarContext'
import { useAuthStore } from '../stores/UseAuthStore'
import SmartPhoneIcon from "@mui/icons-material/Smartphone"
import EmailIcon from "@mui/icons-material/MailOutline"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import AlertModal from '../components/AlertModal';
import Modal from "../components/Modal"
import ModalContent from "../components/UpdatePasswordForm"


const pageTitle = {
  title: '마이페이지',
  subTitle: '내 정보를 관리하고 수정할 수 있습니다.',
};

const loginType = {
  LOCAL: '기본',
  GOOGLE: '구글',
  NAVER: '네이버',
  KAKAO: '카카오'
};

export default function MyPage() {
  const { handleSubmit, control } = useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const showSnackbar = useContext(SnackbarContext);
  const { user, setUser } = useAuthStore();
  const [emailConsent, setEmailConsent] = useState(user?.isEmailConsent ?? false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [withdrawUserModalOpen, setWithdrawUserModalOpen] = useState(false);

  const onSubmit = async (data: any) => {
    console.log('유저 수정 :', data);
    if (user && user.id) {
      try {
        const response = await updateUser(data, imageFile);
        console.log(response)
        setAlertModalOpen(true);
        showSnackbar("사용자 정보를 수정했습니다.", "success");
        const updatedUser = await initUserData();
        setUser(updatedUser.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          let message = (error.response?.data.details && error.response?.data.details !== undefined)
            ? error.response?.data.details : "사용자 정보 수정에 실패했습니다.";
          showSnackbar(message, "error");
        }
      }
    }
  };

  const handleConsentChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const prevValue = emailConsent;
    setEmailConsent(checked);

    if (user && user.id) {
      if (event.target.name === "emailConsent") {
        try {
          await updateEmailConsent(checked);
          const message = checked
            ? "프로모션 이메일 수신에 동의하셨습니다."
            : "프로모션 이메일 수신 동의를 해제하였습니다";
          showSnackbar(message, "success");
        } catch (error) {
          setEmailConsent(prevValue);
          if (axios.isAxiosError(error)) {
            const message =
              error.response?.data.details ?? "프로모션 이메일 수신 동의 상태 변경에 실패했습니다";
            showSnackbar(message, "error");
          }
        }
      }
    }
  };

  const handleUpdatePasswordButton = () => {
    setFormModalOpen(true);
  }

  const withdrawUserButtonHanlder = () => {
    setWithdrawUserModalOpen(true);
  }

  const withdrawUser =() =>{
    try{
      setWithdrawUserModalOpen(false);

    }catch(error){

    }
  }

  return (
    <Box sx={{ mx: 'auto' }}>
      <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
      <Container sx={{
        borderRadius: "5px",
        p: 3,
        ml: 0,
        mr: 0,
        mb: 3,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        width: '100%',
        maxWidth: 'none !important',
        minWidth: '320px',
      }}>
        <Typography variant="h2" gutterBottom>기본 정보</Typography>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center', ml: 3 }}>
            <Avatar
              src={previewUrl ? previewUrl : (user?.fileUrl ? `http://localhost:8080/api${user.fileUrl}` : undefined)}
              alt='유저 이미지 미리보기'
              sx={{ width: 250, height: 250 }}
            ></Avatar>
            <input
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id="image-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file)); // 미리보기 아바타에 반영
                }
              }}
            />
            <label htmlFor='image-upload'>
              <Button variant="contained" color="primary" component="span">
                이미지 변경
              </Button>
            </label>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', mr: 3 }}
          >
            <Typography variant="body1" fontWeight="bold" >이메일</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom fontSize={'1rem'}>{user?.email}</Typography>

            <Typography variant="body1" fontWeight="bold">로그인 유형</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom fontSize={'1rem'}>
              {user?.authProvider && user.authProvider in loginType
                ? `${loginType[user.authProvider as keyof typeof loginType]} 로그인`
                : '알 수 없음'}
            </Typography>

            <Typography variant="body1" fontWeight="bold" gutterBottom>이름</Typography>
            <Controller
              name="name"
              control={control}
              defaultValue={user?.name || ""}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl>
                  <Box>
                    <TextField {...field} required sx={{ minWidth: 500, maxWidth: 1000, width: '30%' }} />
                  </Box>
                </FormControl>
              )}
            />

            <Typography variant="body1" fontWeight="bold" gutterBottom>전화번호</Typography>
            <Controller
              name="phone"
              control={control}
              defaultValue={user?.phone || ""}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  sx={{ minWidth: 500, maxWidth: 1000, width: '30%' }}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    field.onChange(digitsOnly);
                  }}
                />
              )}
            />
            <Box sx={{ display: 'flex', width: "100%", justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleUpdatePasswordButton} variant="contained" color="primary" size='large' sx={{ width: 150 }}>
                비밀번호 변경
              </Button>
              <Button type="submit" variant="contained" color="primary" size='large' sx={{ width: 150 }}>
                내 정보 수정
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      <Container sx={{
        borderRadius: "5px",
        p: 3,
        ml: 0,
        mr: 0,
        mb: 3,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        width: '100%',
        maxWidth: 'none !important',
        minWidth: '320px',
      }}>
        <Typography variant="h2" gutterBottom>프로모션 정보 수신 동의</Typography>
        <Divider></Divider>
        <Box>

          <Box sx={{ display: 'flex', p: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
              <EmailIcon />
              <Typography variant="body1">이메일</Typography>
            </Box>
            <Switch
              checked={emailConsent}
              name='emailConsent'
              onChange={handleConsentChange}></Switch>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', p: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: 'center' }}>
              <SmartPhoneIcon />
              <Typography variant="body1">전화번호</Typography>
            </Box>
            <Switch
              name='phoneConsent'
              disabled></Switch>
          </Box>
        </Box>
      </Container>
      <Button variant="text" sx={{ color: 'gray', textTransform: 'none', display: 'flex', alignItems: 'center', mt: 2, gap: 1 }} onClick={withdrawUserButtonHanlder}>
        <ArrowBackIosNewIcon fontSize="small" sx={{ color: 'gray' }} />
        회원 탈퇴
      </Button>
      <AlertModal
        open={alertModalOpen}
        buttonCount={1}
        onClose={() => { setAlertModalOpen(false) }}
        content='정보를 성공적으로 수정했습니다.'
      />
      <AlertModal
        open={withdrawUserModalOpen}
        buttonCount={2}
        onClose={() => {setWithdrawUserModalOpen(false)}}
        onConfirm={withdrawUser}
        content={"탈퇴하면 회원과 관련된 모든 정보가 삭제됩니다. \n 정말 삭제하시겠습니까?"}
      />
      <Modal open={formModalOpen} handleClose={() => { setFormModalOpen(false) }}
        title={
          { title: '비밀번호 변경하기', subTitle: '' }
        }>
        <ModalContent
          handleClose={() => { setFormModalOpen(false) }}
        />
      </Modal>
    </Box>
  );
}