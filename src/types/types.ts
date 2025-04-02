export interface SalesRecord {
    id: number;
    storeId: number;
    amount: number;
    date: string;
    type: string;
    description: string;
    payment: string;
    etc: string;
  }

export interface pageTitle {
    title: string;
    subTitle : string;
}

export type SalesRecordForm = Omit<SalesRecord, 'id'>;