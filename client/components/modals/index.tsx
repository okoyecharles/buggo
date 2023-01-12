import { useSpring, animated } from '@react-spring/web';
import React from 'react';

interface ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({ open, setOpen, children, style }) => {
  // Open and closing animation
  const spring = useSpring({
    opacity: open ? 1 : 0,
    y: open ? 0 : 50,
    scale: open ? 1 : 0.8,
    config: {
      tension: 300,
    },
  });

  return (
    <div className="text-gray-300 text-ss z-50 isolate font-open">
      <div
        className={`outclick fixed top-0 left-0 w-screen h-screen flex justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm sm:backdrop-blur-0 sm:bg-black/75 z-0 transition ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            setOpen(false);
          }
        }}
      >
        <animated.div
          className="content z-50 bg-gray-800 ring-1 ring-gray-600 sm:ring-0 w-full sm:w-96 p-3 sm:rounded overflow-hidden"
          style={{ ...spring, ...style }}
        >
          {children}
        </animated.div>
      </div>
    </div>
  );
};

export default Modal;
