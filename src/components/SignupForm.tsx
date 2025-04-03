import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Autocomplete, FormControl, Checkbox, InputLabel, OutlinedInput, InputAdornment, Accordion, AccordionSummary, AccordionDetails, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Collapse } from "@mui/material";
import { useForm, Controller } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com'];

export default function SignupForm() {

    // 이메일 자동 완성
    const [inputValue, setInputValue] = useState('');
    const [validOpen, setValidOpen] = useState(false);

    const options = inputValue && !inputValue.includes('@')
        ? emailDomains.map(domain => `${inputValue}@${domain}`)
        : [];

    const {
        control,
        handleSubmit,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
    });

    const onSubmit = (data: any) => {
        console.log('회원가입 데이터:', data);
    };

    return (
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
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                                    sx={{ flex: 4 }}
                                    renderInput={params => {
                                        return <TextField
                                            {...params}
                                            required
                                            margin="normal"
                                            placeholder="이메일"
                                            sx={{ mt: 0, mb: 0 }}
                                        />;
                                    }}
                                />
                                <Button variant="contained" color="primary" sx={{ flex: 1 }}
                                onClick={() => {setValidOpen(true)}}
                                >인증 요청</Button>
                            </Box>
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
                                                sx={{ mt: 0, mb: 0, flex : 4}} />
                                    <Button variant="contained" color="primary" sx={{ flex: 1 }}>인증 하기</Button>
                                </Box>
                            </Box>
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
                                    <Checkbox size='small' />
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

                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, fontSize: 18 }}>
                            회원 가입
                        </Button>

                    </Box>
                </Paper>
            </Box>
        </form>
    );
}