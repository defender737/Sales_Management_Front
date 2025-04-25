import {
  Box,
  TextField,
  Typography,
  Container,
  Button,
  MenuItem,
  Select,
  FormControl,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PageTitle from '../components/PageTitle'
import DaumPostcode from 'react-daum-postcode';
import { createStore, updateStore, deleteStore } from '../api/api'
import { SnackbarContext } from '../contexts/SnackbarContext'
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../stores/useAuthStore'
import { useParams } from 'react-router-dom'
import StoreIcon from '@mui/icons-material/Store';
import { useApiRequest } from '../hooks/useApiRequest';
import { useFetchCurrentUser } from '../hooks/useFetchCurrentUser'
import { useAlertModal } from '../stores/useAlertModal'
import { useFormModal } from '../stores/useFormModal'


const pageTitleForCreate = {
  title: '매장 추가',
  subTitle: '내 매장을 추가합니다.',
};

const pageTitleForEdit = {
  title: '매장 정보 수정',
  subTitle: '내 매장의 정보를 수정합니다.',
};

const categories = [
  { key: 'RESTAURANT', value: '음식점' },
  { key: 'CAFE', value: '카페' },
  { key: 'CONVENIENCE_STORE', value: '편의점' },
  { key: 'GENERAL_STORE', value: '잡화점' },
  { key: 'ETC', value: '기타' }
];

export default function AddStoreForm() {
  const { handleSubmit, control, setValue, reset } = useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const showSnackbar = useContext(SnackbarContext);
  const { fetchCurrentUser } = useFetchCurrentUser();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const { open: openForm, close: closeForm } = useFormModal();
  const { open: openAlert } = useAlertModal();

  useEffect(() => {
    reset({
      storeName: '',
      businessType: '',
      zipCode: '',
      roadAddress: '',
      detailAddress: '',
      description: '',
    });
    setImageFile(null);
    setPreviewUrl(null);

    if (isEdit) {
      const store = user?.storeList.find(store => store.id === Number(id))
      // store 정보 셋
      if (store) {
        setValue('storeName', store.storeName);
        setValue('businessType', store.businessType);
        setValue('zipCode', store.zipCode);
        setValue('roadAddress', store.roadAddress);
        setValue('detailAddress', store.detailAddress);
        setValue('description', store.description);
        setPreviewUrl(`http://localhost:8080/api${store.fileUrl}`);
      }
    }
  }, [id])

  const { request: createOrUpdateRequest, loading : createOrUpdateLoading} = useApiRequest(
    (data) => isEdit ? updateStore(Number(id), data, imageFile) : createStore(data, imageFile),
    () => {
      const message = isEdit ? "매장 정보를 수정했습니다" : "새로운 매장이 등록되었습니다"
      showSnackbar(message, "success");
      fetchCurrentUser();
      openAlert({
        content: isEdit ? "매장 정보를 수정했습니다." : "매장을 추가했습니다.",
        buttonCount: 1,
        onConfirm: () => { !isEdit && navigate('/') }
      })
    },
    (msg) => showSnackbar(msg, "error"),
    {delay: true}
  )

  const { request: deleteRequest, loading : deleteLoading } = useApiRequest(
    () => deleteStore(Number(id)),
    () => {
      const message = "매장을 삭제했습니다."
      showSnackbar(message, "success");
      fetchCurrentUser();
      //TODO : 뒤로가기
    },
    (msg) => showSnackbar(msg, "error"),
  )

  const onSubmit = (data: any) => {
    createOrUpdateRequest(data);
  };

  const handlePostCodeButtonClick = () => {
    openForm({
      title: '주소 검색',
      formComponent: (
        <DaumPostcode onComplete={selectAddress} autoClose={false} style={{
          width: '1000px',
          height: '600px'
        }} />
      )
    });
  }

  const handleDeleteButton = () => {
    openAlert({
      content: "매장을 삭제하면 매장과 관련된 모든 정보가 삭제됩니다. \n 정말 삭제하시겠습니까?",
      buttonCount: 2,
      onConfirm: () => deleteRequest(),
    })
  }

  const selectAddress = (data: any) => {
    const { roadAddress, zonecode, buildingName } = data;
    const fullAddress = buildingName && buildingName !== ''
      ? `${roadAddress}(${buildingName})`
      : roadAddress;
    setValue('roadAddress', fullAddress);
    setValue('zipCode', zonecode);
    closeForm();
  }

  return (
    <Box sx={{ mx: 'auto' }}>
      <PageTitle title={isEdit ? pageTitleForEdit.title : pageTitleForCreate.title} subTitle={isEdit ? pageTitleForEdit.subTitle : pageTitleForCreate.subTitle} />
      <Container sx={{
        borderRadius: "5px",
        p: 3,
        ml: 0,
        mr: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        width: '100%',  // 화면 크기에 맞춰 유동적으로 크기 변화
        maxWidth: 'none !important', // 최대 너비를 100%로 설정
        minWidth: '320px', // 최소 너비 설정 (필요에 따라 조정)
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center', alignItems: 'center', ml: 3 }}>
          <Avatar
            src={previewUrl ? previewUrl : ''}
            alt='매장 이미지 미리보기'
            sx={{ width: 250, height: 250 }}
          >
            <StoreIcon sx={{ fontSize: 150 }} />
          </Avatar>
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
          <Typography variant='subtitle2' fontWeight={600} sx={{ mb: -1, ml: 0.3 }}>매장 이름</Typography>
          <Controller
            name="storeName"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextField {...field} required sx={{ minWidth: 500, maxWidth: 1000, width: '30%' }} />
            )}
          />
          <Typography variant='subtitle2' fontWeight={600} sx={{ mb: -1, ml: 0.3 }}>업종</Typography>
          <Controller
            name="businessType"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl>
                <Select {...field} required sx={{ minWidth: 500, maxWidth: 1000, width: '30%' }}>
                  {categories.map(cat => (
                    <MenuItem key={cat.key} value={cat.key}>
                      {cat.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Typography variant='subtitle2' fontWeight={600} sx={{ mb: -1, ml: 0.3 }}>주소</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Controller
                name="zipCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} sx={{ minWidth: 200, maxWidth: 250 }} placeholder="우편 번호" disabled />
                )}
              />
              <Button variant="contained" color="primary" size='large' onClick={handlePostCodeButtonClick}>주소 검색</Button>
            </Box>
            <Controller
              name="roadAddress"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="도로명 주소" disabled />
              )}
            />
            <Controller
              name="detailAddress"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField {...field} fullWidth placeholder="상세 주소" />
              )}
            />
          </Box>
          <Typography variant='subtitle2' fontWeight={600} sx={{ mb: -1, ml: 0.3 }}>설명</Typography>
          <Controller
            name="description"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} multiline rows={3} />
            )}
          />
          <Box sx={{ display: 'flex', width: "100%", justifyContent: 'flex-end' }}>
            {isEdit &&
              <Button disabled={deleteLoading} onClick={handleDeleteButton} variant="contained" color="error" size='large' sx={{ width: 130, mr: 2 }}>
                {deleteLoading ? <CircularProgress size={20} color='inherit' /> : "매장 삭제"}
              </Button>}
            <Button disabled = {createOrUpdateLoading} type="submit" variant="contained" color="primary" size='large' sx={{ width: 130 }}>
              {createOrUpdateLoading ? <CircularProgress size={20} color='inherit' /> : isEdit ? "정보 수정" : "매장 추가"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}