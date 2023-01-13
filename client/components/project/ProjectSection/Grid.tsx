import React from 'react';
import ProjectCard from '../ProjectCard';
import { Project } from '../../../redux/reducers/projects/types';
interface ProjectsGridType {
  projects: Project[];
  loading: boolean;
  method: {
    [key: string]: any;
  };
}

const ProjectsGrid: React.FC<ProjectsGridType> = ({
  projects,
  loading,
  method,
}) => {
  const [currentEdit, setCurrentEdit] = React.useState<string>('');

  return (
    <>
      <div className="project__container flex flex-col gap-2 mt-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            loading={loading}
            method={method}
            currentEdit={currentEdit}
            setCurrentEdit={setCurrentEdit}
          />
        ))}
      </div>
    </>
  );
};

export default ProjectsGrid;
