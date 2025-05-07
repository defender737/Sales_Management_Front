import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Link, Paper, Divider, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { login } from '../api/api'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useApiRequest } from '../hooks/useApiRequest';
import { useFetchCurrentUser } from '../hooks/useFetchCurrentUser';
import { useState, useRef } from 'react';
interface LoginForm {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [isEmailRemember, setIsEmailRemember] = useState(true);
    const { setAccessToken } = useAuthStore();
    const {fetchCurrentUser} = useFetchCurrentUser();
    const emailRef = useRef(''); 

    const { register, handleSubmit } = useForm<LoginForm>({
      defaultValues: {
        email: localStorage.getItem('loginEmail') || '',
      },
    });
    const navigate = useNavigate();

    const { request: loginRequest, loading: loginLoading } =
        useApiRequest(
            (data: LoginForm) => login(data),
            async (response) => {
                const accessToken = response.data.accessToken;
                setAccessToken(accessToken);
                fetchCurrentUser();
                if (isEmailRemember) {
                    localStorage.setItem('loginEmail', emailRef.current);
                } else {
                    localStorage.removeItem('loginEmail');
                }
                navigate('/sales-expenses');
            },
            (msg) => alert(msg),
            {delay : true}
        )
    const loginSubmit = (data: LoginForm) => {
        emailRef.current = data.email
        loginRequest(data);
    }
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundImage: 'url(/assets/img/backImage.jpg)' }}>
            <Box
                sx={{
                    flex: 3,
                    bgcolor: alpha('#3F72AF', 0.4),
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    p: 4,
                }}
            >
                <Typography variant="h1" fontWeight={600}>
                    Tally
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    우리 가게 매출관리
                </Typography>

            </Box>
            <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: 'rgba(255, 255, 255, 0.92)' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 500, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 'bold' }}>
                            로그인
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit(loginSubmit)}>
                        <TextField {...register("email")} fullWidth margin="normal" label="이메일" variant="standard" />
                        <TextField {...register("password")} fullWidth margin="normal" label="비밀번호" type="password" variant="standard" />
                        <FormControlLabel control={<Checkbox checked={isEmailRemember} onChange={() => setIsEmailRemember(!isEmailRemember)}/>} label="이메일 기억하기" />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Link href="/findPassword" variant="body2" underline='none'>
                                비밀번호 찾기
                            </Link>
                        </Box>
                        <Button type='submit' variant="contained" color="primary" fullWidth sx={{ mt: 3, fontSize: 18 }}>
                            {loginLoading ? (
                                <CircularProgress size={31} sx={{ color: 'inherit' }} />
                            ) : "로그인"
                            }
                        </Button>
                    </form>
                    <Divider sx={{ my: 3 }} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            소셜 계정으로 간편 로그인
                        </Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', gap: 9, alignItems: 'center', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <Button
                            sx={{
                                p: 0,
                                minWidth: 0,
                                borderRadius: '50%',
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/img/icons/kakao_icon.svg"
                                alt="Kakao logo"
                                sx={{ width: 50, height: 50, borderRadius: '50%' }}
                            />
                        </Button>
                        <Button
                            sx={{
                                p: 0,
                                minWidth: 0,
                                borderRadius: '50%',
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/img/icons/naver_icon.png"
                                alt="Naver logo"
                                sx={{ width: 50, height: 50, borderRadius: '50%' }}
                            />
                        </Button>
                        <Button
                            sx={{
                                p: 0,
                                minWidth: 0,
                                borderRadius: '50%',
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/img/icons/google_icon.png"
                                alt="Google logo"
                                sx={{ width: 50, height: 50, borderRadius: '50%' }}
                            />
                        </Button>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', textAlign: 'center', justifyContent: 'center', mt: 3, gap: 2 }}>
                        <Typography variant="subtitle1">
                            아직 계정이 없다면?
                        </Typography>
                        <Link href="/signup" variant="subtitle1" underline='none' fontWeight={'bold'}>
                            회원가입
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}