export const validateName = (name: any) => {
  // validate name is not empty
  if (!name.trim('')) {
    return 'Name cannot be empty';
  };
  return null;
};

export const validateEmail = (email: any) => {
  const emailRegular = /[^A-Za-z0-9]/g;
  // validate email is not empty
  if (!email.trim('')) {
    return 'Email cannot be empty';
  }
  // validate email with regex
  if (!email.match(emailRegular)) {
    return 'Please enter a valid email';
  };
  // validate email is not longer than 50 characters
  if (email.length > 50) {
    return 'Email cannot be longer than 50 characters';
  }
  return null;
};

export const validatePassword = (password: any) => {
  // validate password is not empty
  if (!password.trim('')) {
    return 'Password cannot be empty';
  }
  // validate password length is greater than 6
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  };
  return null;
};

export const validateConfirmPassword = (
  password: any,
  confirmPassword: any) => {
  // make sure password and confirm password match
  if (password !== confirmPassword) {
    return 'Password does not match';
  };

  return null;
};
