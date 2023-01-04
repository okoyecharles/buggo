/* eslint-disable @typescript-eslint/no-explicit-any */

const validateEmail = ({ email, setEmailError }) => {
  const emailRegular = /[^A-Za-z0-9]/g;
  return email && !email.match(emailRegular)
    ? setEmailError('Please enter a valid email')
    : setEmailError('');
};

const validatePassword = ({ password, setPasswordError }) => {
  return password && password.length < 6
    ? setPasswordError('Password must be at least 6 characters')
    : setPasswordError('');
};

const validateConfirmPassword = ({
  password,
  cpassword,
  setCPasswordError,
}) => {
  return password !== cpassword
    ? setCPasswordError('Password does not match')
    : setCPasswordError('');
};

export { validateEmail, validatePassword, validateConfirmPassword };
