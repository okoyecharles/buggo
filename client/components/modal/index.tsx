import { useSpring, animated } from "@react-spring/web";
import React, { useEffect } from "react";
import Portal from "../portal";

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
    <Portal>
      <div
        className="modal text-gray-300 text-ss font-open"
        onKeyDown={(e) => {
          if (e.key === "Escape" && open) {
            setOpen(false);
          }
        }}
      >
        <div
          className={`outclick fixed top-0 left-0 w-screen h-screen flex justify-center items-end sm:items-center bg-black/50 backdrop-blur-sm sm:backdrop-blur-0 sm:bg-black/75 z-0 transition ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => {
            if (e.currentTarget === e.target) {
              setOpen(false);
            }
          }}
        >
          <animated.div
            className="modal-content z-50 bg-gray-800 w-full sm:w-96 p-3 pt-5 sm:pt-3 rounded-t-lg sm:rounded overflow-hidden relative"
            style={{ ...spring, ...style }}
          >
            <span className="rounded h-1 sm:hidden bg-gray-500 w-16 absolute top-3 left-1/2 -translate-x-1/2" />
            {children}
          </animated.div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
