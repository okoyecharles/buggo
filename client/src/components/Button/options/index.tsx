import React from "react";
import { incrementColor } from "../../../utils/stringHelper";

const OptionsButton: React.FC<ButtonProps> = ({
  id,
  color = "blue-500",
  processing,
  children,
  onClick,
  overrideStyle,
}) => {
  return (
    <button
      id={id}
      className={`
        group rounded-sm p-2
        flex justify-between items-center 

        text-${color.split("-")[0] === "red" ? "red-500" : "gray-300"} text-sm
        hover:bg-${color}
        hover:text-${color.split("-")[0] + "-50"}
        active:bg-${incrementColor(color, 100)}
        disabled:opacity-75 disabled:cursor-not-allowed
        
        transition-colors
        ${overrideStyle}
      `}
      disabled={processing}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default OptionsButton;
