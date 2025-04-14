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
} from '@mui/material';
import { useState, useContext} from 'react';
import { useForm, Controller } from 'react-hook-form';
import PageTitle from '../components/PageTitle'
import DaumPostcode from 'react-daum-postcode';
import Modal from '../components/Modal'
import {createStore, initUserData} from '../api/api'
import axios from 'axios';
import {SnackbarContext} from '../contexts/SnackbarContext'
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../stores/UseAuthStore'


const pageTitle = {
    title: '매장 추가',
    subTitle: '내 매장을 추가합니다.',
};

const categories = [
    { key: 'RESTAURANT', value: '음식점' },
    { key: 'CAFE', value: '카페' },
    { key: 'CONVENIENCE_STORE', value: '편의점' },
    { key: 'GENERAL_STORE', value: '잡화점' },
    { key: 'ETC', value: '기타' }
];

export default function AddStoreForm() {
    const { handleSubmit, control, setValue } = useForm();
    const [openPostcode, setOpenPostcode] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [openResultModal, setOpenResultModal] = useState(false);
    const showSnackbar = useContext(SnackbarContext);
    const navigate = useNavigate();

    const handlePostCodeButtonClick = () => {
      setOpenPostcode(true);
    }
    const handlePostCodeClose = () => {
        setOpenPostcode(false);
    }
    const redirectToMain = () => {
      setOpenResultModal(false);
      navigate('/');
     };
    const resultModalClose = () => {
      setOpenResultModal(false);
    }
    const selectAddress = (data: any) => {
        const { roadAddress, zonecode, buildingName } = data;
        const fullAddress = buildingName && buildingName !== ''
            ? `${roadAddress}(${buildingName})`
            : roadAddress;
        setValue('roadAddress', fullAddress);
        setValue('zipCode', zonecode);
        handlePostCodeClose();
    }
    

    const onSubmit = async (data: any) => {

        console.log('매장 등록:', data);
        try{
            const response = await createStore(data, imageFile);
            console.log(response)
            showSnackbar("새로운 매장이 등록되었습니다.", "success");

            const updatedUser = await initUserData();
            useAuthStore.getState().setUser(updatedUser.data);

            setOpenResultModal(true);
        }catch(error){
            if(axios.isAxiosError(error)){
                let message = (error.response?.data.details && error.response?.data.details !== undefined) ? error.response?.data.details : error.response?.data.message;
                alert(message)
                showSnackbar(message, "error");

            }
        }
        // TODO: 서버 전송 로직 추가
    };

    return (
        <Box sx={{ mx: 'auto' }}>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
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
                        src = {previewUrl ? previewUrl : ''}
                        alt='매장 이미지 미리보기'
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
                        <Button type="submit" variant="contained" color="primary" size='large' sx={{ width: 130 }}>
                            매장 추가하기
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Modal open={openPostcode} handleClose={handlePostCodeClose}
                title={{ title: '주소 검색', subTitle: '' }}>
                <DaumPostcode onComplete={selectAddress} autoClose={false} style={{
                    width: '1000px',
                    height: '600px'
                }} />
            </Modal>
             <Modal open = {openResultModal} handleClose={resultModalClose} title={{title :'매장 추가 완료', subTitle : ""}}>
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ mb: 2 }}>
                                새로운 매장이 등록되었습니다.
                            </Typography>
                            {/* <Typography variant="body1" sx={{ mb: 4 }}>
                                새로운 매장을 관리해보세요.
                            </Typography> */}
                            <Button variant="contained" color="primary" onClick={redirectToMain}>
                                메인으로 돌아가기
                            </Button>
                        </Box>
                    </Modal>
        </Box>
    );
}