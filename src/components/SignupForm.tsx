import React, { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button, Autocomplete, FormControl, Checkbox, CircularProgress, OutlinedInput, Accordion, AccordionSummary, AccordionDetails, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Collapse} from "@mui/material";
import { useForm, Controller, set } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {requestEmailVerification, requestEmailCodeVerification, register} from '../api/api';
import { SnackbarContext } from '../contexts/SnackbarContext';
import {registerWithoutEmailVerified} from '../types/types';
import Modal from './Modal'
import axios from 'axios';


const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

export default function SignupForm() {

    const codeRef = useRef<HTMLInputElement>(null);
    const showSnackbar = React.useContext(SnackbarContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState(''); // 이메일 자동 완성, 인증 요청
    const [validOpen, setValidOpen] = useState(false); // 인증 코드 입력창 열기
    const [emailVarifyButtonLoading, setEmailVarifyButtonLoading] = useState(false); // 이메일 인증 코드 요청 중 로딩
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
    const [emailRequestDisabled, setEmailRequestDisabled] = useState(false); // 이메일 인증 비활성화(인증 완료 후)
    const [modalOpen, setModalOpen] = useState(false); // 회원가입 완료 모달 열기
    const [signupComplite, setSignupComplite] = useState(false); // 회원가입 완료 상태(회원 가입 버튼 비활성화)
    const [emailError, setEmailError] = useState<string | null>(null); // 이메일 오류 메시지(중복 등)
    const [emailCodeError, setEmailCodeError] = useState<string | null>(null); // 이메일 인증 코드 오류 메시지(인증 코드 불일치 등)

    const handleClose = () => {setModalOpen(false);};

    const options = email && !email.includes('@')
        ? emailDomains.map(domain => `${email}@${domain}`)
        : [];

    const {
        control,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm<registerWithoutEmailVerified>({
    });

    const onSubmit = async (data: registerWithoutEmailVerified) => {

        if (!isEmailVerified) {
            showSnackbar("이메일 인증을 완료해주세요.", "error");
            return;
        }
        if(signupComplite){
            alert("이미 회원가입이 완료되었습니다.");
            return;
        }
        try{
            const response = await register({...data, isEmailVerified : isEmailVerified, email : email});
            showSnackbar(response.data, "success");
            setSignupComplite(true); // 회원가입 완료 상태로 변경
            setModalOpen(true); // 회원가입 완료 모달 열기
        }catch (error) {
            console.error("회원가입 실패:", error);
            showSnackbar("회원가입에 실패하였습니다. 다시 시도해주세요.", "error");
        }        
    };

    const emailVarifyRequest = async() => {
        setEmailVarifyButtonLoading(true);
        setEmailRequestDisabled(true);
        try{
            const response = await requestEmailVerification(email);
            showSnackbar(response.data, "success");
            setEmailError(null);
            setValidOpen(true);
        }catch (error) {
            if(axios.isAxiosError(error)){
                console.log(error)
                let message = error.response?.data?.details;
                showSnackbar(message, "error");
                setEmailError(typeof message === "string" ? message : "이메일 오류 발생");
            }         
        }finally{
            setEmailVarifyButtonLoading(false);
            setEmailRequestDisabled(false);
        }
    }

    const emailVarifyCodeRequest = async() => {
        const code = codeRef.current?.value;
        if(!code){
            showSnackbar("인증코드를 입력해주세요.", "error");
            return;
        }
        try{
            const response = await requestEmailCodeVerification(email, code);
            console.log("인증 요청 결과:", response);
            showSnackbar(response.data, "success");
            setIsEmailVerified(true);
            setValidOpen(false);
            setEmailRequestDisabled(true);
        }catch (error) {
            if(axios.isAxiosError(error)){
                const message = error.response?.data?.details;
                showSnackbar(message, "error");
                setEmailCodeError(typeof message === "string" ? message : "이메일 코드 오류 발생");
            }else{
                showSnackbar("인증 요청에 실패하였습니다.", "error");
            }
        }
    }
    const redirectToLogin = () => {
         navigate('/login');
    }
    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: "100vw" }}>
                <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 600, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 'bold' }}>
                            회원 가입
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                이메일
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                <Autocomplete
                                    freeSolo
                                    options={options}
                                    inputValue={email}
                                    onInputChange={(event, newInputValue) => setEmail(newInputValue)}
                                    disabled={emailRequestDisabled}
                                    sx={{ flex: 4 }}
                                    renderInput={params => {
                                        return <TextField
                                            {...params}
                                            name='email'
                                            required
                                            margin="normal"
                                            placeholder="이메일"
                                            error={!!emailError}
                                            sx={{ mt: 0, mb: 0, backgroundColor : isEmailVerified ? 'rgba(77, 166, 0, 0.1)' : "white"}}
                                        />;
                                    }}
                                />
                                <Button variant="contained" color="primary" sx={{ flex: 1 }}
                                onClick={emailVarifyRequest}
                                disabled={emailRequestDisabled}
                                >
                                {emailVarifyButtonLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                ) : isEmailVerified ?(
                                    "인증 완료"
                                ) : "인증 요청"
                                }    
                                </Button>
                            </Box>
                            {!!emailError && (
                                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                {emailError}
                                </Typography>
                            )}
                        </Box>
                        {validOpen && (
                        <Collapse in={validOpen}>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                    인증번호
                                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                        *
                                    </Typography>
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <TextField
                                                required
                                                margin="normal"
                                                placeholder="인증번호"
                                                sx={{ mt: 0, mb: 0, flex : 4}}
                                                inputRef ={codeRef}
                                                error={!!emailCodeError}
                                                />
                                    <Button variant="contained" color="primary" sx={{ flex: 1 }} onClick={emailVarifyCodeRequest}>인증 하기</Button>
                                </Box>
                            </Box>
                            {!!emailCodeError && (
                                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                {emailCodeError}
                                </Typography>
                            )}
                        </Collapse>
                        )}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                비밀번호
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Typography>
                            <Typography variant="caption" gutterBottom sx={{ display: 'block', color : 'gray'}}>비밀번호는 8글자 이상이어야 합니다.</Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: '비밀번호는 필수입니다.', minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' } }}
                                    render={({ field }) => (
                                        <FormControl required sx={{ flex: 4 }} error={!!errors.password}>
                                            <OutlinedInput {...field}
                                                placeholder="비밀번호"
                                                type="password"
                                                onBlur={e => {
                                                    field.onBlur();
                                                    trigger('password');
                                                }}
                                            />
                                            {errors.password && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                                    {errors.password.message as string}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                비밀번호 확인
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    rules={{ validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.' }}
                                    render={({ field }) => (
                                        <FormControl required sx={{ flex: 4 }} error={!!errors.confirmPassword}>
                                            <OutlinedInput {...field}
                                                placeholder="비밀번호 확인"
                                                type="password"
                                                onBlur={e => {
                                                    field.onBlur();
                                                    trigger('confirmPassword');
                                                }}
                                            />
                                            {errors.confirmPassword && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                                    {errors.confirmPassword.message as string}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                이름
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: '이름은 필수입니다.' }}
                                    render={({ field }) => (
                                        <FormControl required sx={{ flex: 4 }} error={!!errors.name}>
                                            <OutlinedInput {...field} placeholder="이름" />
                                            {errors.name && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                                    {errors.name.message as string}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                연락처
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                    *
                                </Typography>
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: '연락처는 필수입니다.' }}
                                    render={({ field }) => (
                                        <FormControl required sx={{ flex: 4 }} error={!!errors.phone}>
                                            <OutlinedInput 
                                                {...field} 
                                                placeholder="연락처"
                                                onChange={(e) => {
                                                    const digitsOnly = e.target.value.replace(/\D/g, '');
                                                    field.onChange(digitsOnly);
                                                }}
                                            />
                                            {errors.phone && (
                                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                                    {errors.phone.message as string}
                                                </Typography>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Box>
                        </Box>

                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                    개인정보 수집 및 이용 동의
                                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                        *
                                    </Typography>
                                    <Controller
                                        name='agreeCheck'
                                        control={control}
                                        rules={{ required: '개인정보 수집 및 이용 동의는 필수입니다.' }}
                                        render={({ field }) => (
                                            <Checkbox {...field}  size='small' />
                                        )}
                                    />
                                    {errors.agreeCheck && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                        {errors.agreeCheck.message as string}
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                >
                                    <Typography component="span">개인정보 수집 및 이용</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="" sx={{ tableLayout: "fixed" }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align='center'>항목</TableCell>
                                                    <TableCell align='center'>목적</TableCell>
                                                    <TableCell align='center'>기간</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align='center'>이름, 연락처<br /> 이메일, 비밀번호</TableCell>
                                                    <TableCell align='center'>회원 식별,<br />알림 서비스</TableCell>
                                                    <TableCell align='center'>수집 일로부터<br />탈퇴 시까지</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </Box>

                        <Button type="submit" variant="contained" color="primary" disabled={!isEmailVerified || signupComplite} fullWidth sx={{ mt: 3, fontSize: 18 }}>
                            회원 가입
                        </Button>

                    </Box>
                </Paper>
            </Box>
        </form>
        <Modal open = {modalOpen} handleClose={handleClose} title={{title :'회원가입 완료', subTitle : ""}}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    회원가입이 완료되었습니다.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    환영합니다! 이제 서비스를 이용하실 수 있습니다.
                </Typography>
                <Button variant="contained" color="primary" onClick={redirectToLogin}>
                    로그인 화면으로 돌아가기
                </Button>
            </Box>
        </Modal>
        </>
    );
}