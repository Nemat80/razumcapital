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
    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/12  h-5/6 bg-dark-2 max-md:w-full   bg-opacity-85 backdrop-filter backdrop-blur-3 p-4 rounded-lg  p-1 mt-1  border-white-200 flex flex-col text-light-1 z-50"
    >
        <Button className='self-end mt-2 mr-3 bg-red-500' onClick={onClose}>Закрыть</Button>
           <div className=" w-full h-screen mt-4">
           {children}
           </div>
    </div>,
    document.body
  );
};

export default Modal;