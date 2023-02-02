import React from 'react';
import { Project } from '../../../../../redux/reducers/projects/types';
import Image from 'next/image';

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
  return (
    <div className="flex mb-2 gap-2 lg:items-center text-ss lg:h-7">
      <h4 className="font-bold text-gray-400 flex items-center">MEMBERS:</h4>
      <div className="flex gap-2 items-center h-7 overflow-hidden">
        {project.team.length ? (
          <>
            {project.team.slice(0, 3).map((member) => (
              <Image
                key={member._id}
                src={member.image}
                alt={member.name}
                width={28}
                height={28}
                className="h-full object-center object-cover rounded-full ring-1 ring-orange-500/50 bg-gray-800"
              />
            ))}
            {project.team.length > 3 ? (
              <p className="text-sm font-noto font-semibold text-orange-500/90 whitespace-nowrap">
                +{project.team.length - 3} more
              </p>
            ) : (
              ''
            )}
          </>
        ) : (
          <p className="text-ss text-gray-500">No team members</p>
        )}
      </div>
      {
        // Display button if user does not exist in team
        !isInTeam(project) ? (
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
