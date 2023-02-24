import React, { useState } from "react";
import { ThreeDotsLoader } from "../../features/loader";
import { useSpring, a } from "@react-spring/web";

interface ButtonProps {
  children: React.ReactNode;
  color?: string;
  processing?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  overrideStyle?: string;
}

const incrementColor = (color: string, incrementValue?: number) => {
  const [name, value] = color.split("-");

  return `${name}-${parseInt(value) + (incrementValue || 100)}`;
};

const Button: React.FC<ButtonProps> = ({
  color,
  processing,
  children,
  onClick,
  overrideStyle,
}) => {
  return (
    <button
      className={`
        font-open font-semibold text-ss text-white
        flex justify-center items-center rounded
        p-2 relative isolate
        
        bg-${color || "blue-500"}

        hover:bg-${incrementColor(color || "blue-500")}
        
        disabled:opacity-75 disabled:cursor-not-allowed
        transition-colors
        ${overrideStyle || ""}
      `}
      onClick={onClick}
      disabled={processing || false}
    >
      {processing ? <ThreeDotsLoader /> : children}
    </button>
  );
};

export default Button;
