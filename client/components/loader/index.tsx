import React from "react";
import { TailSpin, ThreeDots } from "react-loader-spinner";

interface LoaderProps {
  color?: string;
  height?: string | number;
  width?: string | number;
  className?: string;
}

const ThreeDotsLoader: React.FC<LoaderProps> = ({
  color = "#fff",
  height = "22",
  width = "30",
}) => (
  <ThreeDots
    height={height}
    width={width}
    radius="9"
    color={color}
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    visible={true}
  />
);

const TailSpinLoader: React.FC<LoaderProps> = ({
  color = "#fff",
  height = "30",
  width = "30",
  className
}) => (
  <TailSpin
    height={height}
    width={width}
    color={color}
    ariaLabel="tail-spin-loading"
    radius="2"
    wrapperStyle={{}}
    wrapperClass={className}
    visible={true}
  />
);

export { ThreeDotsLoader, TailSpinLoader };
