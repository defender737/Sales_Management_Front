import React from 'react';

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

export const SnackbarContext = React.createContext<
  (message: string, severity?: SnackbarSeverity) => void
>(() => {});