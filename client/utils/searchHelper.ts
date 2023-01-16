import { Project } from '../redux/reducers/projects/types';
import User from '../redux/reducers/user/types';

const searchByNameOrEmail = (search: string, users: User[]) => {
  const searchRegex = new RegExp(search, 'i');
  return users.filter(
    (user) => searchRegex.test(user.name) || searchRegex.test(user.email)
  );
};

const searchProjectByName = (search: string, projects: Project[]) => {
  if (!search.trim()) return projects;
  const searchRegex = new RegExp(search.trim(), 'i');
  return projects.filter((project) => searchRegex.test(project.title));
};

export { searchByNameOrEmail, searchProjectByName };
