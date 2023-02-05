import moment from "moment";
import React, { useState } from "react";
import { BsPlus } from "react-icons/bs";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Project } from "../../../../redux/reducers/projects/types";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { IoMdClose } from "react-icons/io";
import ProjectDetailsOptionsPopup from "./Options";
import ProjectAssignModal from "../../dashboard/projects/Modals/projectAssign";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";

interface ProjectDetailsBarProps {
  project: Project | null;
  loading: boolean;
  method: any;
}

const ProjectDetailsBar: React.FC<ProjectDetailsBarProps> = ({
  project,
  loading,
  method,
}) => {
  const [membersOpen, setMembersOpen] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const currentUser = useSelector((store: storeType) => store.currentUser);

  return (
    <aside className="project- w-full lg:w-56 bg-gray-850 relative">
      {/* Project details header */}
      <header
        className="
        p-3 px-6 h-16 lg:px-3 flex justify-between items-center shadow-sm shadow-gray-950 font-semibold text-gray-300 cursor-pointer transition-colors
        hover:bg-gray-825 hover:text-gray-100
        "
        onClick={() => {
          setOptionsOpen(!optionsOpen);
        }}
      >
        <span className="truncate font-bold text-gray-100 text-lg">
          {project?.title}
        </span>
        <div className="relative w-6 h-6">
          <MdOutlineKeyboardArrowDown
            className={`text-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
              optionsOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-1"
            } transition-all`}
          />
          <IoMdClose
            className={`text-xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
              optionsOpen ? "rotate-0 opacity-1" : "-rotate-180 opacity-0"
            } transition-all`}
          />
        </div>
      </header>

      {/* Project details content */}
      <div className="project-info p-3 px-1 text-gray-300 flex flex-col gap-2">
        <p className="text-gray-400 px-2 text-sm">
          {moment(project?.createdAt).format("[Created on] MMMM D, YYYY")}
        </p>

        <div className="members-drop font-noto">
          <div className=" flex items-center gap-0 cursor-pointer group transition-all select-none relative h-8">
            <MdOutlineKeyboardArrowRight
              className={`text-lg group-hover:text-gray-100 transition ${
                membersOpen ? "rotate-90" : "rotate-0"
              }`}
              onClick={() => setMembersOpen(!membersOpen)}
            />
            <span
              className="flex-1 group-hover:text-gray-100 text-white text-sm uppercase font-semibold"
              onClick={() => setMembersOpen(!membersOpen)}
            >
              Members
            </span>
            {currentUser.user?._id === project?.author._id && (
              <>
                <BsPlus
                  className="text-2xl bg-orange-500 text-white hover:bg-orange-600 rounded-full transition-colors"
                  id="assign-members"
                  onClick={() => {
                    if (project) setAssignOpen(true);
                  }}
                />
                <Tooltip anchorId="assign-members" content="Assign Members" />
              </>
            )}
          </div>
          <ul
            className={`font-noto text-sm text-gray-200 flex flex-col gap-2 ${
              membersOpen ? "block" : "hidden"
            } transition-all`}
          >
            {project?.team.map((member) => (
              <li
                key={member._id}
                className="p-1 px-2 rounded flex items-center gap-2 bg-gray-825 transition-colors select-none cursor-default capitalize hover:bg-gray-800 mx-2"
              >
                <div className="w-6 h-6 rounded overflow-hidden">
                  <Image
                    className="h-full object-cover"
                    src={member.image}
                    width={30}
                    height={30}
                    alt={member.name}
                  />
                </div>
                <span>{member.name}</span>
              </li>
            ))}
          </ul>
          {!project?.team.length && (
            <p className="p-1 px-2 rounded flex font-normal items-center gap-2 select-none cursor-default">
              No team members assigned
            </p>
          )}
        </div>
      </div>
      <ProjectDetailsOptionsPopup open={optionsOpen} setOpen={setOptionsOpen} />
      {project && (
        <ProjectAssignModal
          open={assignOpen}
          setOpen={setAssignOpen}
          project={project}
          loading={loading}
          method={method}
        />
      )}
    </aside>
  );
};

export default ProjectDetailsBar;
