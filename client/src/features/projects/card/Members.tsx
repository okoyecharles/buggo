import React from 'react';
import { Project } from '../../../types/models';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { storeType } from '../../../../redux/configureStore';
import ImageRow from '../../../components/ImageRow';

interface ProjectCardMembersProps {
  project: Project;
  isInTeam: any;
  handleAssign: any;
  loading: any;
  method: any;
}

const ProjectCardMembers: React.FC<ProjectCardMembersProps> = ({
  project,
  isInTeam,
  handleAssign,
  loading,
  method,
}) => {
  const user = useSelector((store: storeType) => store.currentUser.user);

  return (
    <div className="flex mb-2 gap-2 lg:items-center text-ss lg:h-7">
      <h4 className="font-bold text-gray-400 flex items-center">MEMBERS:</h4>
      <ImageRow model={project} maxImages={3} />
      {
        // Display button if user does not exist in team
        !isInTeam(project) && user?._id === project.author._id ? (
          <button
            className="hidden lg:flex items-center h-full hover:underline text-orange-500/75 self-start disabled:opacity-75"
            onClick={handleAssign}
            disabled={loading && method.update}
          >
            Assign Yourself?
          </button>
        ) : (
          ''
        )
      }
    </div>
  );
};

export default ProjectCardMembers;
