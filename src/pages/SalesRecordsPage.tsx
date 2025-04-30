import Record from '../components/Records'
import { getSalesRecordsList } from '../api/api';
import {ResponseSalesRecord, RequestSalesRecordsList} from '../types/types';
import SalesRecordForm from '../components/SalesRecordForm';

// 테이블의 열 이름
const expenseColumns = [
  { key: "no", label: "No.", width: "8%" },
  { key: "date", label: "날짜", width: "15%" },
  { key: "totalAmount", label: "총 매출", width: "12%", unit : '원'},
  { key: "hallAmount", label: "홀 매출", width: "12%", unit : '원' },
  { key: "deliveryAmount", label: "배달 매출", width: "12%", unit : '원' },
  { key: "takeoutAmount", label: "포장 매출", width: "12%", unit : '원' },
  { key: "totalCommission", label: "총 수수료", width: "12%", unit : '원' },
  { key: "etc", label: "비고", width: "auto" },
];


export default function ExpenseRecordsPage() {
  return (
    <Record<ResponseSalesRecord, RequestSalesRecordsList> // T : 레코드 Response 타입, F : 레코드리스트 Request 타입
      pageTitle={{ title: '매출 기록', subTitle: '매출 내역을 기록하고 조회합니다.' }} // 페이지 제목
      columns={expenseColumns} // Table의 열 이름
      requestApi={getSalesRecordsList} // 레코드 리스트 Request API
      renderForm={(mode, rowId, close) => (
        <SalesRecordForm mode={mode} rowId={rowId} handleSubbmitAndClose={close} />
      )}
    />
  );
}
