import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { storeType } from '../../redux/configureStore';

const ProjectDetails: React.FC = () => {
  const projects = useSelector((store: storeType) => store.projects);
  const router = useRouter();
  const { id } = router.query;
  const project = projects.projects.find((project) => project._id === id);
  console.log(project);

  return (
    <div>
      <h2>Project details for the ID</h2>
    </div>
  );
};

export default ProjectDetails;
