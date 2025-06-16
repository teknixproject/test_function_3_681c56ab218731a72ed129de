'use client';

import { useEffect } from 'react';
import ReactModal from 'react-modal';

import { useHandleData } from '@/hooks/useHandleData';
import { useUpdateData } from '@/hooks/useUpdateData';

interface ModalProps {
  data: any;
  children?: any;
  [key: string]: unknown;
}

const Modal = ({ children, data, ...props }: ModalProps) => {
  const { dataState } = useHandleData({ dataProp: data?.data });

  const { updateData } = useUpdateData({ dataProp: data?.data });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appRoot = document.getElementById('__next');
      if (appRoot) {
        ReactModal.setAppElement(appRoot);
      }
    }
  }, []);

  return (
    <ReactModal
      isOpen={dataState}
      onRequestClose={updateData}
      shouldCloseOnOverlayClick={true}
      style={{
        content: {
          position: 'absolute',
          background: 'lightblue',
          padding: '30px',
          borderRadius: '10px',
          margin: 'auto',
          zIndex: 1000,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }}
      {...props}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
