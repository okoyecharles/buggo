import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = ({ color = "#fff", height = "22", width="30" }: any) => (
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

export default Loader;
