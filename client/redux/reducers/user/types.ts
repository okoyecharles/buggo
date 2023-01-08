interface User {
  _id: string,
  name: string;
  image: string;
  email: string;
  password: string;
  admin: boolean;
  googleId?: string | undefined;
};

export default User;