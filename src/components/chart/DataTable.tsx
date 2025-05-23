import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface DataTableProps {
    headers: string[];
    rows: { label: string; data: number[] }[];
    tableRow: string
}

export default function DataTable({ headers, rows, tableRow }: DataTableProps) {
    return (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }} >
            <Table sx={{ tableLayout: 'auto', width: '100%', minWidth: 1600 }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', minWidth : 120 }}>구분</TableCell>
                        {headers.map((header, idx) => (
                            <TableCell key={idx} align="center" sx={{ fontWeight: 'bold', minWidth : 100 }}>{header}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{ fontWeight: 'bold' }}>{row.label}</TableCell>
                            {row.data.map((value, i) => (
                                i === headers.length - 1 ? (
                                    <TableCell key={i} align="center" sx={{ fontWeight: 'bold', borderLeft: '1px solid #ccc' }}>
                                        {value.toLocaleString()}원
                                    </TableCell>
                                ) : (
                                    <TableCell key={i} align="center">
                                        {value.toLocaleString()}원
                                    </TableCell>
                                )
                            ))}
                        </TableRow>
                    ))}
                    {
                        tableRow === "netProfit" 
                        ?
                            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>순수익</TableCell>
                                {headers.map((_, i) => {
                                    const income = rows.find(row => row.label === '매출')?.data[i] || 0;
                                    const expenses = rows.find(row => row.label === '지출')?.data[i] || 0;
                                    return (
                                        i === headers.length - 1 ? (
                                            <TableCell key={i} align="center" sx={{ fontWeight: 'bold', borderLeft: '1px solid #ccc' }}>
                                                {(income - expenses).toLocaleString()}원
                                            </TableCell>
                                        ) : (
                                            <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>
                                                {(income - expenses).toLocaleString()}원
                                            </TableCell>
                                        )
                                    );
                                })}
                            </TableRow>
                            :
                            tableRow === "total" 
                            ?
                                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>총계</TableCell>
                                    {headers.map((_, i) => {
                                        const total = rows.reduce((acc, row) => acc + (row.data[i] || 0), 0);
                                        return (
                                            i === headers.length - 1 ? (
                                                <TableCell key={i} align="center" sx={{ fontWeight: 'bold', borderLeft: '1px solid #ccc' }}>
                                                    {total.toLocaleString()}원
                                                </TableCell>
                                            ) : (
                                                <TableCell key={i} align="center" sx={{ fontWeight: 'bold' }}>
                                                    {total.toLocaleString()}원
                                                </TableCell>
                                            )
                                        );
                                    })}
                                </TableRow>
                                :
                                <></>
                    }

                </TableBody>
            </Table>
        </TableContainer>
    );
}