import React, { useMemo } from "react";
import ButtonProps from "@/core/components/button/types";

const OptionsButton: React.FC<ButtonProps> = ({
  id,
  color="blue-600",
  processing,
  children,
  onClick,
  overrideStyle,
	ariaLabel,
}) => {
  const colors = useMemo(() => ({
    text: color.split("-")[0] === "red" ? "text-red-500" : "text-gray-300",
    textHover: "text-white",
    bgHover: color.split("-")[0] === "red" ? "bg-red-600" : `bg-${color}`,
  }), [color]);

  return (
    <button
      id={id}
			aria-label={ariaLabel}
      className={`
        group rounded-sm p-2 text-sm
        flex justify-between items-center

        ${colors.text}
        hover:${colors.bgHover}
        hover:${colors.textHover}

        disabled:opacity-90 disabled:cursor-not-allowed
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
