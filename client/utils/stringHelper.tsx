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
