import {useContext} from 'react'
import { Box, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import PageTitle from '../components/PageTitle';
import { useForm, Controller } from 'react-hook-form';
import { useApiRequest } from '../hooks/useApiRequest';
import { useAuthStore } from '../stores/useAuthStore';
import {helpRequest} from '../types/types'
import {sendHelp} from '../api/api'
import { SnackbarContext } from '../contexts/SnackbarContext';
import { useAlertModal } from '../stores/useAlertModal'


const pageTitle = {
    title: '지원',
    subTitle: '문의 사항을 남겨주시면 이메일로 답변 해 드릴 예정입니다'
};

export default function HelpPage() {

    const {user} = useAuthStore();
    const showSnackbar = useContext(SnackbarContext)
    const { handleSubmit, control } = useForm<helpRequest>();
    const { open: openAlert } = useAlertModal();
    const {request, loading} = useApiRequest(
        (data : helpRequest) =>  sendHelp(data),
        (response) => {
            openAlert({
                content: response.data,
                buttonCount: 1,
              })
        },
        (msg) => showSnackbar(msg,'error'),
        {delay : true}
    ) 

    const onSubmit = (data: helpRequest) => {
        request(data);
    }

    const templete = "문의할 매장 이름: \n\n문의 내용: "

    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            <PageTitle title={pageTitle.title} subTitle={pageTitle.subTitle} />
            <Box>
                <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>이메일</Typography>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue={user?.email}
                                render={({ field }) =>
                                    <TextField {...field} fullWidth />
                                }
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>제목</Typography>
                            <Controller
                                name="title"
                                control={control}
                                defaultValue=""
                                render={({ field }) =>
                                    <TextField {...field} fullWidth />
                                }
                            />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>내용</Typography>
                            <Controller
                                name="content"
                                control={control}
                                defaultValue={templete}
                                render={({ field }) =>
                                    <TextField
                                        {...field}
                                        multiline
                                        rows={10}
                                        fullWidth
                                    />
                                }
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                        <Button disabled = {loading} type='submit' variant="contained" size="large" sx={{ ml: 2, width: 150, minHeight:'42.5px' }}>
                            {loading ? <CircularProgress size='1.3em' color='inherit' /> : "보내기"}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Box>

    );
}