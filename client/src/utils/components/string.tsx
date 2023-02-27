export const restrictLength = (str: string = "", length: number) => {
  if (str.length > length) {
    return str.slice(0, length) + "...";
  }
  return str;
};

export const returnWithLineBreaks = (str: string = "") => {
  return str.split("\n").map((line: string, index: number) => (
    <>
      <span key={index}>{line}</span>
      <br />
    </>
  ));
};

export const returnWithTwoDigitsOrMore = (str: string | number) => {
  str = str.toString();
  const appendStr = str.length < 2 ? "0" : "";
  return appendStr + str;
};

export const incrementColor = (color: string, incrementValue?: number) => {
  const [name, value] = color.split("-");

  return `${name}-${parseInt(value) + (incrementValue || 100)}`;
};