import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import React from 'react';

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  content: string;
  cancelText?: string;
  confirmText?: string;
  buttonCount?: 0 | 1 | 2;
}

const AlertModal = ({
  open,
  onClose,
  onConfirm,
  content,
  cancelText = '취소',
  confirmText = '확인',
  buttonCount = 2,
}: AlertModalProps) => {
    
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          overflow: 'hidden',
          minWidth: 360,
          textAlign: 'center',
        },
      }}
    >
      <DialogContent sx={{ py: 5 }}>
        {content.split('\n').map((line, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{ fontWeight: index === content.split('\n').length - 1 ? 700 : 500, mb: 1 }}
          >
            {line}
          </Typography>
        ))}
      </DialogContent>

      <Box sx={{ display: 'flex', width: '100%', height: 56 }}>
        {buttonCount === 1 ? (
          <Button
            variant='contained'
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'primary',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: 0,
            }}
          >
            {confirmText}
          </Button>
        ) : buttonCount === 2 && (
          <>
            <Button
              onClick={onClose}
              variant='contained'
              sx={{
                width: '50%',
                height: '100%',
                bgcolor: '#9AA0A6',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 0,
              }}
            >
              {cancelText}
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              sx={{
                width: '50%',
                height: '100%',
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: 0,
              }}
            >
              {confirmText}
            </Button>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default AlertModal;