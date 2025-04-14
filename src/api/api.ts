// src/api/api.ts
import axios from 'axios';
import {registerForm, storeForm} from '../types/types'
import { setAccessToken, getAccessToken } from '../stores/UseAuthStore'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',  // 기본 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 포함하여 요청
});

let isRefreshing = false;
let failedQueue : any[] = [];

const processQueue = (error: any, token : string | null = null) => {
  failedQueue.forEach((prom : any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

const setToken = setAccessToken;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 엑세스토큰 만료 등 401 발생 시
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.headers['X-Reissue']) {
      if (isRefreshing) {
        // api요청이 동시에 일어났고 이미 refreshToken을 요청중인 경우
        // 대기열failedQueue에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      // 토큰 요청 재발급 요청 상태로 전환
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await reissueAccessToken();
        const newAccessToken = response.data.accessToken;
        // 상태 업데이트
        setToken(newAccessToken); // <- 상태 변수에 저장
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);
        return api(originalRequest); // 원래 요청 다시 실행
      } catch (err) {
        // 토큰 재발급 실패시 모든 대기 요청에 대해 실패 처리
        processQueue(err, null);
        setToken(null); // 토큰 삭제
        console.log(err);
        // 로그아웃 처리 등 추가 작업 필요
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && !config.url?.includes('auth')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export const deleteSalesRecord = (id : number) => {
  return api.delete(`records/${id}`)
}

export const requestEmailVerification = (email : string) => {
  return api.post('auth/email/verify-request', { email })
}

export const requestEmailCodeVerification = (email : string, code: string) => {
  return api.post('auth/email/verify-check', { email, code })
}

export const register = (registerForm : registerForm) => {
  return api.post('auth/signup', registerForm)
}

export const login = (loginForm : {email: string, password: string}) => {
  return api.post('auth/login', loginForm)
}

export const reissueAccessToken = () => {
  return api.post('auth/reissue', {},  {headers: { 'X-Reissue': 'true' }})
}

export const initUserData = () => {
  return api.get('user/me')
}

export const createStore = (storeData : storeForm, imageFile : File | null) => {
  const formData = new FormData();

  formData.append('store', new Blob([JSON.stringify(storeData)], {type : 'application/json'}));

  if(imageFile){
    formData.append('image', imageFile);
  }

  return api.post('/store', formData, {
    headers:{
      'Content-Type' : 'multipart/form-data'
    }
  });
}

export const updateUser = (id: number, userData : {name: string, phone: string}, imageFile : File | null) => {
  const formData = new FormData();

  formData.append('user', new Blob([JSON.stringify(userData)], {type: 'application/json'}));

  if(imageFile){
    formData.append('image', imageFile);
  }

  return api.put(`user/${id}`, formData, {
    headers:{
      'Content-Type' : 'multipart/form-data'
    }
  });
}
