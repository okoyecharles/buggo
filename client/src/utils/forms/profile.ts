export const validateProfileName = (name: string) => {
  // validate name is not empty
  if (!name.trim()) {
    return 'Name is required';
  };

  // validate name is not shorter than 5 characters
  if (name.length < 5) {
    return 'Name must be at least 5 characters';
  }

  // validate name is not longer than 25 characters
  if (name.length > 25) {
    return 'Name cannot exceed 25 characters';
  }
  return null;
};

export const validateProfileImage = (image: string) => {
  // validate an image is set, either a base64 upload or a default avatar url
  if (!image.trim()) {
    return 'Image is required';
  };
  return null;
};
