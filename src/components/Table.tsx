import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface TableProps<T> {
  data: T[]; // 테이블에 표시할 데이터
  columns: { key: string, label: string }[]; // 테이블의 열 이름
  keyExtractor: (item: T) => string | number; // 데이터의 키를 추출하는 함수
  onRowClick? : (id : number) => void;
}

export default function BasicTable<T>({ data, columns, keyExtractor, onRowClick}: TableProps<T>) {
  return (
    <TableContainer component={Paper} sx={{minHeight: 587}}>
      <Table sx={{ minWidth: 650 }} aria-label="table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell align='left'>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => (
              <TableRow 
                key={keyExtractor(row)}
                hover
                tabIndex={-1} // 키보드 탭 포커스 방지
                sx={{'&:hover' : {cursor : ' pointer'}}}
                onClick={() => (onRowClick ? onRowClick(keyExtractor(row) as number) : undefined)}
                >
                {columns.map((column) => (
                  <TableCell key={`${keyExtractor(row)}-${column.key}`} align="left">
                    {String(row[column.key as keyof T])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                데이터가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}