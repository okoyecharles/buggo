import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = ({ color = "#fff" }: any) => (
  <ThreeDots
    height="22"
    width="30"
    radius="9"
    color={color}
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    visible={true}
  />
);

export default Loader;
