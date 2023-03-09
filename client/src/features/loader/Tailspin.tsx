import { TailSpin } from "react-loader-spinner";
import LoaderProps from "./types";

const TailSpinLoader: React.FC<LoaderProps> = ({
  color = "#fff",
  height = "30",
  width = "30",
  className = "",
}) => (
  <TailSpin
    height={height}
    width={width}
    color={color}
    ariaLabel="tail-spin-loading"
    radius="1"
    wrapperStyle={{}}
    wrapperClass={className}
    visible={true}
  />
);

export default TailSpinLoader;