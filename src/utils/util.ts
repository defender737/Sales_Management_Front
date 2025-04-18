// 유틸 함수

// utils.ts
export const utils = {
  formatNumberWithCommas: (value: number): string => {
    const number = Number(value.toString().replace(/,/g, ''));
    return isNaN(number) ? '' : number.toLocaleString();
  },
  getTodayDate: (): string => {
    return new Date().toISOString().split('T')[0];
  },
  getOneMonthAgoDate: (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }
};