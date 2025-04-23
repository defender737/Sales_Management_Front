import { useFormContext, Controller } from 'react-hook-form';
import { TextField, Checkbox, FormControlLabel, Box, Avatar, InputAdornment, Typography } from '@mui/material';

interface DeliveryCompanyCardProps {
    name: string;
    image: string;
    nameKo: string,
}

export default function DeliveryCompanyCard({ name, image, nameKo}: DeliveryCompanyCardProps) {
    const { control } = useFormContext();
    return (
        <Box
            sx={{
                width: '100%',
                height: 'auto',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                p: 3,
                gap: 2,
            }}
        >
            <Avatar
                variant="rounded"
                src={image}
                alt="배달대행 업체 이미지"
                sx={{ width: 56, height: 56 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ fontWeight: 'bold' }}>{nameKo}</Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>수수료율:</Typography>
                <Controller
                    name={`${name}CommissionRate`}
                    control={control}
                    rules={{ required: true, min: 0, max: 100 }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="number"
                            variant="outlined"
                            size="small"
                            sx={{ width: 100 }}
                            value={field.value ?? ''}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                    )}
                />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>서비스 사용 여부: </Typography>
                <Controller
                    name={`${name}Enabled`}
                    control={control}
                    render={({ field }) => (
                        <Checkbox checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />
                    )}
                />
            </Box>
        </Box>


    );
}