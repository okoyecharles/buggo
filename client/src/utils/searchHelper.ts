import { Project, User } from '../types/models';

const searchByNameOrEmail = (search: string, users: User[]) => {
  const searchRegex = new RegExp(search.trim(), 'i');

  // Search all users by name or email (without domain)
  return users.filter((user) => {
    const email = user.email.split('@')[0];
    return searchRegex.test(user.name) || searchRegex.test(email);
  });
};

const searchProjectByName = (search: string, projects: Project[]) => {
  if (!search.trim()) return projects;
  const searchRegex = new RegExp(search.trim(), 'i');
  return projects.filter((project) => searchRegex.test(project.title));
};

export { searchByNameOrEmail, searchProjectByName };
