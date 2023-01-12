export const restrictLength = (str: string = "", length: number) => {
  if (str.length <= length) {
    return str;
  }

  return (
    <>
      {str.substring(0, length)}
      <span className="text-gray-300">...</span>
    </>
  );
};
