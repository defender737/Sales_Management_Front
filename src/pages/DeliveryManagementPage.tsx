import {
  Box,
  Container,
  Button,
  CircularProgress
} from '@mui/material';
import { useEffect, useContext } from 'react';
import PageTitle from '../components/PageTitle'
import { useForm, FormProvider } from 'react-hook-form';
import DeliveryCompanyCard from '../components/DeliveryCompanyCard';
import SaveIcon from '@mui/icons-material/Save';
import { useSelectedStore } from '../stores/useSelectedStore';
import { useApiRequest } from '../hooks/useApiRequest';
import { updateDelveryPlatformInfo, getDelveryPlatformInfo } from '../api/api';
import { DeliveryPlatform } from '../types/types';
import { SnackbarContext } from '../contexts/SnackbarContext';


const pageTitle = {
  title: '배달 관리',
  subTitle: '',
}

export default function DeliveryManagementPage() {
  const methods = useForm();
  const { selectedStoreId } = useSelectedStore();
  const showSnackbar = useContext(SnackbarContext)
  const { request: updateRequest, loading: updateLoading } = useApiRequest(
    (storeId: number, data: DeliveryPlatform) => updateDelveryPlatformInfo(storeId, data),
    (response) => {
      showSnackbar(response.data, "success");
    },
    (msg) => showSnackbar(msg, "error"),
    { delay: true }
  );

  const { request: getRequest} = useApiRequest(
    (storeId: number) => getDelveryPlatformInfo(storeId),
    (response) => {
      methods.reset(response.data);
    },
    (msg) => showSnackbar(msg, "error"),
  );


  const onSubmit = (data: any) => {
    if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
    updateRequest(selectedStoreId, data);
  };

  useEffect(() => {
    if (!selectedStoreId) return showSnackbar("매장 정보를 찾을 수 없습니다.", "error");
    getRequest(selectedStoreId)
  }, [selectedStoreId]);

  return (
    <Box sx={{ mx: 'auto' }}>
      <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
      <Container sx={{
        width: '100%',
        maxWidth: 'none !important',
        minWidth: '320px',
      }}>
        <FormProvider {...methods}>
          <Box component={'form'} onSubmit={methods.handleSubmit(onSubmit)}>
            <DeliveryCompanyCard name='baemin' nameKo="배달의 민족" image="/assets/img/icons/beamin.png" />
            <DeliveryCompanyCard name='baemin1' nameKo="배민1" image="/assets/img/icons/beamin1.png" />
            <DeliveryCompanyCard name='yogiyo' nameKo="요기요" image='/assets/img/icons/yogiyo.png' />
            <DeliveryCompanyCard name='coupangEats' nameKo="쿠팡이츠" image='/assets/img/icons/coupangEats.png' />
            <DeliveryCompanyCard name='ddangyo' nameKo="땡겨요" image='/assets/img/icons/ddangyo.png' />
            <DeliveryCompanyCard name='brand' nameKo="브랜드 배달" image='/assets/img/icons/delivery_company.png' />
            <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
              <Button disabled={updateLoading} type='submit' variant="contained" size="large" sx={{ ml: 2, width: 150, minHeight:'42.5px' }}>
                {updateLoading ? (
                  <CircularProgress size='1.3em' sx={{ color: 'inherit' }} />
                ) : (
                  <>
                    <SaveIcon sx={{ mr: 1 }} /> 저장 하기
                  </>
                )}
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Container>
    </Box>
  );
}