import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { requestEmailVerificationForPasswordReset, requestEmailCodeVerification, resetPassowrd } from '../api/api';
import { registerWithoutEmailVerified, resetPasswordRequest } from '../types/types';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Autocomplete,
    FormControl,
    CircularProgress,
    OutlinedInput,
    Collapse
} from "@mui/material";

import { SnackbarContext } from '../contexts/SnackbarContext';
import { useApiRequest } from '../hooks/useApiRequest';
import { useAlertModal } from '../stores/useAlertModal';

const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

export default function SignupPage() {

    const codeRef = useRef<HTMLInputElement>(null);
    const showSnackbar = React.useContext(SnackbarContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState(''); // 이메일 자동 완성, 인증 요청
    const [validOpen, setValidOpen] = useState(false); // 인증 코드 입력창 열기
    const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 여부
    const [emailRequestDisabled, setEmailRequestDisabled] = useState(false); // 이메일 인증 비활성화(인증 완료 후)
    const [signupComplite, setSignupComplite] = useState(false); // 회원가입 완료 상태(회원 가입 버튼 비활성화)
    const [emailError, setEmailError] = useState<string | null>(null); // 이메일 오류 메시지(중복 등)
    const [emailCodeError, setEmailCodeError] = useState<string | null>(null); // 이메일 인증 코드 오류 메시지(인증 코드 불일치 등)
    const { open: openAlert } = useAlertModal();


    const { request: registerRequest, loading: registerLoading } =
        useApiRequest(
            (data: resetPasswordRequest) =>
                resetPassowrd(data),
            () => {
                setSignupComplite(true);
                openAlert({
                    content: "비밀번호를 변경했습니다.",
                    buttonCount: 1,
                    confirmText: "로그인 페이지로 돌아가기",
                    onConfirm: () => { navigate('/login'); }
                })
            },
            (msg) => showSnackbar(msg, "error"),
            { delay: true }
        )

    const { request: emailVarifyRequest, loading: emailVarifyLoading } =
        useApiRequest(
            (email: string) => requestEmailVerificationForPasswordReset(email),
            (response) => {
                showSnackbar(response.data, "success");
                setEmailError(null);
                setValidOpen(true);
            },
            (msg) => {
                setEmailError(typeof msg === "string" ? msg : "이메일 오류 발생");
                showSnackbar(msg, "error")
            }
        )

    const { request: emailCodeVarifyRequest, loading: emailCodeVarifyLoading } =
        useApiRequest(
            (email: string, code: string) => requestEmailCodeVerification(email, code),
            (response) => {
                showSnackbar(response.data, "success");
                setIsEmailVerified(true);
                setValidOpen(false);
                setEmailRequestDisabled(true);
            },
            (msg) => {
                setEmailCodeError(typeof msg === "string" ? msg : "이메일 코드 오류 발생");
                showSnackbar(msg, "error")
            },
            { delay: true }
        )

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

    const onSubmit = (data: registerWithoutEmailVerified) => {
        const {password} = data;
        if (!isEmailVerified) {
            showSnackbar("이메일 인증을 완료해주세요.", "error");
            return;
        }
        if (signupComplite) {
            alert("이미 회원가입이 완료되었습니다.");
            return;
        }
        registerRequest({newPassword : password, email : email})
    };

    const emailVarify = async () => {
        setEmailRequestDisabled(true);
        emailVarifyRequest(email);
        setEmailRequestDisabled(false);
    }

    const emailCodeVarify = async () => {
        const code = codeRef.current?.value;
        if (!code) {
            showSnackbar("인증코드를 입력해주세요.", "error");
            return;
        }
        emailCodeVarifyRequest(email, code)
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: "100vw" }}>
                    <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 600, borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="h4" sx={{ color: "primary.main", fontWeight: 'bold' }}>
                                비밀번호 찾기
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
                                                sx={{ mt: 0, mb: 0, backgroundColor: isEmailVerified ? 'rgba(77, 166, 0, 0.1)' : "white" }}
                                            />;
                                        }}
                                    />
                                    <Button variant="contained" color="primary" sx={{ flex: 1 }}
                                        onClick={emailVarify}
                                        disabled={emailRequestDisabled}
                                    >
                                        {emailVarifyLoading ? (
                                            <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                        ) : isEmailVerified ? (
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
                                                sx={{ mt: 0, mb: 0, flex: 4 }}
                                                inputRef={codeRef}
                                                error={!!emailCodeError}
                                            />
                                            <Button variant="contained" color="primary" sx={{ flex: 1 }}
                                                onClick={emailCodeVarify}
                                                disabled={emailCodeVarifyLoading}
                                            >
                                                {emailCodeVarifyLoading ? (
                                                    <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                                ) : "인증 하기"
                                                }
                                            </Button>
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
                                    새 비밀번호
                                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>
                                        *
                                    </Typography>
                                </Typography>
                                <Typography variant="caption" gutterBottom sx={{ display: 'block', color: 'gray' }}>비밀번호는 8글자 이상이어야 합니다.</Typography>
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
                                    새 비밀번호 확인
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
                            <Button type="submit" variant="contained" color="primary" disabled={!isEmailVerified || signupComplite} fullWidth sx={{ mt: 3, fontSize: 18 }}>
                                {registerLoading ? (
                                    <CircularProgress size={24} sx={{ color: 'inherit' }} />
                                ) : "변경 하기"
                                }
                            </Button>

                        </Box>
                    </Paper>
                </Box>
            </form>
        </>
    );
}