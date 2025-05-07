import * as React from 'react';
import { Box, Fade } from '@mui/material';
import Modal from '@mui/material/Modal';
import ModalTitle from './ModalTitle'
import Close from '@mui/icons-material/Close'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  borderRadius: 8,
  boxShadow: 24,
  p: 4,
  display: 'inline-block',
  maxHeight: '90vh',
  overflowY: 'auto',

};

interface modalProps {
  open: boolean,
  handleClose: () => void
  children: React.ReactNode,
  title: { title: string, subTitle?: string }
}

export default function BasicModal({ open, handleClose, children, title }: modalProps) {

  return (
    <>
      {/* <Global
        styles={{
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      /> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <ModalTitle title={title.title} subTitle={title.subTitle} />
              <Close onClick={handleClose} sx={{ cursor: 'pointer', color: '#c4c4c4', mb: 3 }} fontSize='large' />
            </Box>
            <Box sx={{overflowY : 'auto', maxHeight: '75vh'}}>
              {children}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}