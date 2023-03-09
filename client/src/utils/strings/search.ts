import { Project, User } from '../../types/models';

const searchByNameOrEmail = (search: string, users: User[]) => {
  const searchValue = search.trim().toLowerCase();

  return users.filter((user) => {
    const email = user.email.split('@')[0].toLowerCase();
    const name = user.name.toLowerCase();

    return name.includes(searchValue) || email.includes(searchValue);
  });
};

const searchProjectByTitle = (search: string, projects: Project[]) => {
  return projects.filter((project) => {
    const title = project.title.toLowerCase();
    return title.includes(search);
  });
};

export { searchByNameOrEmail, searchProjectByTitle as searchProjectByName };
