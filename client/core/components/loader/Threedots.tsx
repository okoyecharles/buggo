import { ThreeDots } from "react-loader-spinner";
import LoaderProps from "./types";

const ThreeDotsLoader: React.FC<LoaderProps> = ({
  color = "#fff",
  height = "22",
  width = "30",
  className = "",
}) => (
  <ThreeDots
    height={height}
    width={width}
    radius="9"
    color={color}
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass={className}
    visible={true}
  />
);

export default ThreeDotsLoader;