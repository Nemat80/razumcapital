import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return createPortal(
    <div
    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6/12 h-5/6 bg-dark-2 rounded-md p-1 mt-1 border-2 border-white-300 flex flex-col text-light-1 z-50"
    >
        <Button className='self-end  bg-red-500' onClick={onClose}>Закрыть</Button>
           <div className=" w-full h-screen">
           {children}
           </div>
    </div>,
    document.body
  );
};

export default Modal;