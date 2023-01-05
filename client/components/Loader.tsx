import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = () => (
  <ThreeDots
    height="22"
    width="30"
    radius="9"
    color="#fff"
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    visible={true}
  />
);

export default Loader;
