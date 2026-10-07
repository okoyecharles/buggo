export const validateCommentText = (text: string) => {
  // validate comment is not empty
  if (!text.trim()) {
    return 'Comment cannot be empty';
  };

  // validate comment is not longer than 500 characters
  if (text.length > 500) {
    return 'Comment is too long';
  }
  return null;
};
