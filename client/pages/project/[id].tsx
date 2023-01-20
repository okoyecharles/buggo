import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import store, { storeType } from '../../redux/configureStore';
import { useSelector } from 'react-redux';
import { fetchProjectById } from '../../redux/actions/projectActions';

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const project = useSelector((store: storeType) => store.project);

  useEffect(() => {
    if (!project.loading && id) {
      store.dispatch(fetchProjectById(id as string));
    }
  }, []);

  return (
    <div>
      <h2>Project details, ID: {id}</h2>
      <h3>Project Name: {project.project?.title}</h3>
    </div>
  );
};

export default ProjectDetails;
