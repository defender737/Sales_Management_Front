// src/api/api.ts
import axios from 'axios';
import { 
  registerForm,
  storeForm,
  ExpenseRecordFormRequest,
  RequestExpenseRecordsList,
  DeliveryPlatform,
  SalesRecordFormRequest,
  RequestSalesRecordsList
} from '../types/types'
import { setAccessToken, getAccessToken } from '../stores/useAuthStore'

const api = axios.create({
  baseURL: 'http://localhost:8080/api/',  // 기본 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 포함하여 요청
});
let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
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

/**
 * 지출 기록 관리 API
 * 
 * 아래 기능들을 제공합니다:
 * - 지출 기록 목록 조회 (필터 조건 가능)
 * - 특정 지출 기록 상세 조회 (ID로 조회)
 * - 새로운 지출 기록 생성 (지정한 매장에 기록 추가)
 * - 기존 지출 기록 수정 (ID로 수정)
 * - 지출 기록 삭제 (ID로 삭제)
 */
export const getExpenseRecordsList = (params : RequestExpenseRecordsList) => {
  return api.get('records/expense', { params });
};
export const getExpenseRecord = (id: number) => {
  return api.get(`records/expense/${id}`)
}
export const createExpenseRecord = (storeId : number, record: ExpenseRecordFormRequest) => {
  return api.post(`records/expense?storeId=${storeId}`, record);
};
export const updateExpenseRecord = (id: number, record: ExpenseRecordFormRequest) => {
  return api.put(`records/expense/${id}`, record)
}
export const deleteExpenseRecord = (id: number) => {
  return api.delete(`records/expense/${id}`)
}

/**
 * 매출 기록 관리 API
 * 
 * 아래 기능들을 제공합니다:
 * - 매출 기록 목록 조회 (필터 조건 가능)
 * - 특정 매출 기록 상세 조회 (ID로 조회)
 * - 새로운 매출 기록 생성 (지정한 매장에 기록 추가)
 * - 기존 매출 기록 수정 (ID로 수정)
 * - 매출 기록 삭제 (ID로 삭제)
 */
export const getSalesRecordsList = (params : RequestSalesRecordsList) => {
  return api.get('records/sales', { params });
};
export const getSalesRecord = (id: number) => {
  return api.get(`records/sales/${id}`)
}
export const createSalesRecord = (storeId : number, record: SalesRecordFormRequest) => {
  return api.post(`records/sales?storeId=${storeId}`, record);
};
export const updateSalesRecord = (id: number, record: SalesRecordFormRequest) => {
  return api.put(`records/sales/${id}`, record)
}
export const deleteSalesRecord = (id: number) => {
  return api.delete(`records/sales/${id}`)
}

/**
 * 회원 가입 API
 * 
 * 아래 기능들을 제공합니다:
 * - 이메일 발송 코드 오쳥(이메일로 요청)
 * - 이메일 발송 코드 인증(이메일과 이메일 코드로 요청)
 * - 회원가입
 */
export const requestEmailVerification = (email: string) => {
  return api.post('auth/email/verify-request', { email })
}
export const requestEmailCodeVerification = (email: string, code: string) => {
  return api.post('auth/email/verify-check', { email, code })
}
export const register = (registerForm: registerForm) => {
  return api.post('auth/signup', registerForm)
}

/**
 * 로그인 및 토큰 리프레쉬 API
 * 
 * 아래 기능들을 제공합니다:
 * - 로그인
 * - 리프레쉬 토큰으 이용한 엑세스토큰 재요청
 * - 로그인 후 사용자 정보 요청
 */
export const login = (loginForm: { email: string, password: string }) => {
  return api.post('auth/login', loginForm)
}
export const reissueAccessToken = () => {
  return api.post('auth/reissue', {}, { headers: { 'X-Reissue': 'true' } })
}
export const initUserData = () => {
  return api.get('user/me')
}
export const logout = () => {
  return api.post('/auth/logout');
}

/**
 * 매장 API
 * 
 * 아래 기능들을 제공합니다:
 * - 매장 생성(이미지 파일 포함)
 * - 매장 수정(이미지 파일 포함)
 * - 매장 삭제
 */
export const createStore = (storeData: storeForm, imageFile: File | null) => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return api.post('store', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const updateStore = (storeId: number, storeData: storeForm, imageFile: File | null) => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return api.put(`store/${storeId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const deleteStore = (id: number) => {
  return api.delete(`store/${id}`)
}

/**
 * 유저 정보 API
 * 
 * 아래 기능들을 제공합니다:
 * - 유저 정보 수정(이미지 파일 포함)
 * - 유저 이메일 프로모션 동의 여부 수정(이미지 파일 포함)
 * - 비밀번호 변경
 * - 탈퇴
 */
export const updateUser = (userData: { name: string, phone: string }, imageFile: File | null) => {
  const formData = new FormData();
  formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return api.put(`user`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const updateEmailConsent = (emailConsent: boolean) => {
  return api.patch(`user/emailConsent`, emailConsent);
}
export const updatePassword = (passwordData: { currentPassword: string, newPassword: string }) => {
  return api.patch('auth/password', passwordData)
}
export const withdraw = () => {
  return api.delete('/user');
}

/**
 * 배달 관리 API
 * 
 * 아래 기능들을 제공합니다:
 * - 배달 플랫폼 별 수수료율, 사용 여부 정보 조회
 * - 배달 플랫폼 별 수수료율, 사용 여부 수정
 */
export const getDelveryPlatformInfo = (storeId : number) => {
  return api.get(`/deliveryCommission/${storeId}`);
}
export const updateDelveryPlatformInfo = (storeId : number, data : DeliveryPlatform) => {
  return api.put(`/deliveryCommission/${storeId}`, data);
}

export const getSalesExpenseStats = (storeId: number, year: string, isExcludeDeliveryFee : boolean) => {
  return api.get(`/summary/salesExpense/monthly?storeId=${storeId}&year=${year}&excludeDeliveryFee=${isExcludeDeliveryFee}`);
}

export const getSalesTypeStats = (storeId: number, year: string, isExcludeDeliveryFee : boolean) => {
  return api.get(`/summary/salesType/monthly?storeId=${storeId}&year=${year}&excludeDeliveryFee=${isExcludeDeliveryFee}`);
}
