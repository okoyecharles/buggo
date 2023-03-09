import React from "react";
import { useSpring, a } from "@react-spring/web";

const OptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  children: React.ReactNode;
  style?: string;
}> = ({ open, setOpen, children, style }) => {
  const spring = useSpring({
    opacity: 0,
    y: -10,
    scale: 0.8,
    to: {
      opacity: open ? 1 : 0,
      y: open ? 0 : -10,
      scale: open ? 1 : 0.8,
    },
    config: {
      tension: 350,
      friction: 25,
    },
  });

  return (
    <a.div
      className={`absolute top-4 right-4 w-48 bg-gray-950 shadow-lg shadow-gray-950/40 rounded-md p-2 z-40 isolate ring-1 ring-gray-800 ${style || ""}`}
      style={{
        ...spring,
        pointerEvents: open ? "all" : "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        className={open ? "fixed top-0 left-0 h-screen w-screen -z-10" : ""}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className="flex flex-col gap-[0.3rem]">{children}</div>
    </a.div>
  );
};

export default OptionsPopup;
