import React from "react";
import { TailSpin } from "react-loader-spinner";

const TicketStatsLoader = () => {
  return (
    <TailSpin
      height="60"
      width="60"
      color="#ea580b"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass="self-center mt-auto mb-auto"
      visible={true}
    />
  );
};

export default TicketStatsLoader;
