// MainContent에 렌더링할 컴포넌트의 제목타입
export type pageTitle ={
  title: string;
  subTitle: string;
}

// 지출 기록 RequestType
export type RequestExpenseRecordsList = {
  storeId: number,
  page: number,
  size: number,
  sortOrder: string,
  payment: string,
  startDate?: string,
  endDate?: string
}

// 지출 기록 ResponseType
export type ResponseExpenseRecord = {
  no?: number,
  id: number;
  amount: number;
  date: string;
  detail: string;
  detailKo?: string;
  payment: string;
  paymentKo?: string;
  etc: string;
}

// 지출 기록 생성 및 수정 RequestType
export type ExpenseRecordFormRequest = Omit<ResponseExpenseRecord, 'id' | 'no' | 'detailKo' | 'paymentKo'>;

// 지출 기록 RequestType
export type RequestSalesRecordsList = {
  storeId: number,
  page: number,
  size: number,
  sortOrder: string,
  startDate?: string,
  endDate?: string
}

// 매출 기록 ResponseType
export type ResponseSalesRecord = {
  no?: number;
  id: number;
  date: string;
  totalAmount: number;
  hallAmount: number;
  takeoutAmount: number;
  deliveryAmount: number;
  totalCommission: number;
  etc: string;
}

export type SalesRecordFormRequest = {
  total?: number;
  totalDelivery?: number;
  baemin: number;
  baemin1: number;
  coupangEats: number;
  yogiyo: number;
  ddangyo: number;
  brand: number;
  takeout: number;
  hall: number;
  date: string;
  etc: string;
}

// 회원가입 요청 타입
export type registerForm = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  isEmailVerified: boolean;
  agreeCheck: boolean;
}
// 회원 가입 요청 타입에서 이메일 인증 여부를 제외한 타입
export type registerWithoutEmailVerified = Omit<registerForm, 'isEmailVerified'>;

// 내 정보 요청 타입
export type initUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  authProvider: string,
  storeList: Store[];
  fileUrl?: string;
  isEmailConsent: boolean;
};

// 매장 정보 타입
export type Store = {
  id: number;
  storeName: string;
  businessType: string;
  roadAddress?: string;
  detailAddress?: string;
  description: string;
  zipCode?: string;
  fileUrl?: string;
};

// 매장 정보 요청 타입
export type storeForm = Omit<Store, 'id'>;

// 배달 관리 정보
export type DeliveryPlatform = {
  baeminCommissionRate: number;
  baemin1CommissionRate: number;
  yogiyoCommissionRate: number;
  coupangEatsCommissionRate: number;
  ddangyoCommissionRate: number;
  brandCommissionRate: number;
}
