import User from "../redux/reducers/user/types";

const searchByNameOrEmail = (search: string, users: User[]) => {
  console.log(users);
  const searchRegex = new RegExp(search, "i");
  return users.filter(
    (user) => searchRegex.test(user.name) || searchRegex.test(user.email)
  );
};

export { searchByNameOrEmail };