import React from 'react';
import { Project } from '../../../types/models';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { storeType } from '../../../../redux/configureStore';
import ImageRow from '../../../components/ImageRow';

interface ProjectCardMembersProps {
  project: Project;
}

const ProjectCardMembers: React.FC<ProjectCardMembersProps> = ({
  project,
}) => {
  const user = useSelector((store: storeType) => store.currentUser.user);

  return (
    <div className="flex mb-2 gap-2 lg:items-center text-ss lg:h-7">
      <h4 className="font-bold text-gray-400 flex items-center">MEMBERS:</h4>
      <ImageRow model={project} maxImages={3} />
    </div>
  );
};

export default ProjectCardMembers;
