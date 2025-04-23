export interface getSalesRecordList {
  storeId: number,
  page: number,
  size: number,
  order: string,
  type: string,
  startDate?: string,
  endDate?: string
}

export interface SalesRecord {
  no?: number,
  id: number;
  amount: number;
  date: string;
  type: string;
  detail: string;
  detailKo?: string;
  payment: string;
  etc: string;
}

export interface pageTitle {
  title: string;
  subTitle: string;
}

export type SalesRecordForm = Omit<SalesRecord, 'id'>;

export type registerForm = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  isEmailVerified: boolean;
  agreeCheck: boolean;
}

export type registerWithoutEmailVerified = Omit<registerForm, 'isEmailVerified'>;

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

export type storeForm = Omit<SalesRecord, 'id'>;

export type DeliveryPlatform = {
  beaminEnabled: boolean;
  beamin1Enabled: boolean;
  yogiyoEnabled: boolean;
  coupangEatsEnabled: boolean;
  ddangyoEnabled: boolean;
  brandEnabled: boolean;
  beaminCommissionRate: number;
  beamin1CommissionRate: number;
  yogiyoCommissionRate: number;
  coupangEatsCommissionRate: number;
  ddangyoCommissionRate: number;
  brandCommissionRate: number;
}

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
