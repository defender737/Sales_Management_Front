import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectProps {
  value: string;
  label: string;
  onChange : (event: SelectChangeEvent) => void;
  options : { value: string, label: string }[];
  labelId : string;
  id : string;
}

export default function SelectSmall({ value, label, onChange, options, labelId, id}: SelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event); // 부모 컴포넌트에서 전달된 onChange 호출
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
      <InputLabel id="demo-select-small-label">정렬</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}