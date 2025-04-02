// src/api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',  // 기본 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 매장별 매출 내역 조회
export const getSalesRecordsList = (
    storeId: number,
    page: number,
    size: number,
    order: string,
    type : string,
    startDate?: string,
    endDate?: string
  ) => {
    const params: any = {
      storeId,
      page,
      size,
      sortOrder: order,
      type
    };
  
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
    }
  
    return api.get('records', { params });
  };

  export const getSalesRecords = (id : number) => {
    return api.get(`records/${id}`)
  }

// 매출/지출 기록 생성
export const createSalesRecord = (record: {
  storeId : number
  date: string;
  type: string;
  amount: number;
  description: string;
  payment: string;
  etc: string;
}) => {
  return api.post('records', record);
};

export const editSalesRecord = (id : number, record : {
  storeId : number
  date: string;
  type: string;
  amount: number;
  description: string;
  payment: string;
  etc: string;
}) => {
  return api.put(`records/${id}`, record)
}

export const deleteSalesRecord = ( id : number) => {
  return api.delete(`records/${id}`)
}