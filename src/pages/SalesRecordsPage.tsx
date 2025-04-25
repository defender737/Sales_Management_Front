import { useState } from 'react';
import Record from '../components/Records'
import { getExpenseRecordsList } from '../api/api';
import {ResponseExpenseRecord, RequestExpenseRecordsList} from '../types/types';
import ExpenseRecordForm from '../components/ExpenseRecordForm';

// 테이블의 열 이름
const expenseColumns = [
  { key: "no", label: "No.", width: "8%" },
  { key: "date", label: "날짜", width: "15%" },
  { key: "amount", label: "총 매출", width: "15%" },
  { key: "paymentKo", label: "홀 매출", width: "15%" },
  { key: "detailKo", label: "배달 매출", width: "15%" },
  { key: "paymentKo", label: "포장 매출", width: "15%" },
  { key: "etc", label: "비고", width: "auto" },
];


export default function ExpenseRecordsPage() {
  const [paymentValue, setPaymentValue] = useState('all');

  return (
    <Record<ResponseExpenseRecord, RequestExpenseRecordsList> // T : 레코드 Response 타입, F : 레코드리스트 Request 타입
      pageTitle={{ title: '매출 기록', subTitle: '매출 내역을 기록하고 조회합니다.' }} // 페이지 제목
      columns={expenseColumns} // Table의 열 이름
      requestApi={getExpenseRecordsList} // 레코드 리스트 Request API
      renderForm={(mode, rowId, close) => (
        <ExpenseRecordForm mode={mode} rowId={rowId} handleSubbmitAndClose={close} />
      )}
    />
  );
}
