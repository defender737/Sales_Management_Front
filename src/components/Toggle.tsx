import { styled } from '@mui/material/styles';
import { Box, ToggleButtonGroup, ToggleButton, toggleButtonGroupClasses } from '@mui/material';

interface ToggleProps {
    buttons: {
        label: string;
        value: string;
    }[];
    value: string;
    onChange: (event: React.MouseEvent<HTMLElement>, value: string) => void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: theme.shape.borderRadius,
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
        },
    }
}));

export default function Toggle({ buttons, value, onChange }: ToggleProps) {
    return (
        <Box sx={(theme) => ({
            display: 'flex',
            border: `1px solid ${theme.palette.divider}`,
            flexWrap: 'wrap',
            borderRadius : 1
        })}>
            <StyledToggleButtonGroup
                exclusive
                value={value}
                color='primary'
                onChange={onChange}
                aria-label="text alignment"
                sx={{ display: "grid", gridAutoColumns: "1fr", gridAutoFlow: "column", }}
            >
                {buttons.map(({ label, value: btnValue }) => (
                    <ToggleButton key={btnValue} value={btnValue} aria-label={btnValue}>
                        {label}
                    </ToggleButton>
                ))}
            </StyledToggleButtonGroup>
        </Box>
    )

}