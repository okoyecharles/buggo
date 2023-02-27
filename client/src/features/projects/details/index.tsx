import { useState } from "react";
import { Project } from "../../../types/models";
import { useSelector } from "react-redux";
import store, { storeType } from "../../../../redux/configureStore";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { FiCheckCircle } from "react-icons/fi";
import getDate from "../../../utils/dateHelper";
import Image from "next/image";
import { BsPlus } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import ProjectDetailsOptionsPopup from "./Options";
import ProjectInviteModal from "../modal/projectInvite";
import Button from "../../../components/Button";
import { acceptInvite } from "../../../../redux/actions/projectActions";
import { a, useSpring, useTrail } from "@react-spring/web";

interface ProjectDetailsBarProps {
  project: Project | null;
  loading: boolean;
  method: any;
  setTicketCreateOpen: any;
  setProjectDeleteOpen: any;
}

const ProjectDetailsBar: React.FC<ProjectDetailsBarProps> = ({
  project,
  loading,
  method,
  setTicketCreateOpen,
  setProjectDeleteOpen,
}) => {
  const [membersOpen, setMembersOpen] = useState(true);
  const [invitedMembersOpen, setInvitedMembersOpen] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const user = useSelector((store: storeType) => store.currentUser.user);

  const membersOpenTrail = useTrail(project?.team.length || 0, {
    translateX: membersOpen ? "0%" : "-110%",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  const membersOpenToggleSpring = useSpring({
    height: membersOpen ? `${(project?.team.length || 0) * (32 + 8)}px` : "0px",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  const invitedMembersOpenTrail = useTrail(project?.invitees.length || 0, {
    translateX: invitedMembersOpen ? "0%" : "-110%",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  const invitedMembersOpenToggleSpring = useSpring({
    height: invitedMembersOpen ? `${(project?.invitees.length || 0) * (32 + 8)}px` : "0px",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  return (
    <aside className="project-details-bar w-full lg:w-60 bg-gray-850 sticky lg:relative z-30">
      {/* Project details header */}
      <header
        className="
        p-3 px-6 h-16 lg:px-3 flex justify-between items-center shadow-sm shadow-gray-950 font-semibold text-gray-300 cursor-pointer transition-colors
        hover:bg-gray-825 hover:text-gray-100
        "
        onClick={() => {
          if (!project || user?._id !== project?.author._id) return;
          setOptionsOpen(!optionsOpen);
        }}
      >
        <span className="truncate font-bold text-gray-100 text-lg">
          {project?.title}
        </span>
        {user?._id === project?.author._id && (
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
        )}
      </header>

      {/* Project details content */}
      <div className="project-info p-3 px-1 text-gray-300 flex flex-col">
        <p className="text-gray-400 px-2 text-sm mb-2">
          {`Created ${getDate(project?.createdAt, {
            format: "on calendar",
          })}`}
        </p>

        {project?.invitees.some(
          (i) => i.user._id === user?._id
        ) && (
          <Button
            overrideStyle="mx-1"
            onClick={() => {
              store.dispatch(acceptInvite(project._id));
            }}
            processing={loading && method.acceptInvite}
          >
            Accept Invitation <FiCheckCircle className="ml-1 text-md" />
          </Button>
        )}

        <div className="members-drop font-noto">
          <div className=" flex items-center gap-0 cursor-pointer group transition-all select-none relative h-8 mb-1">
            <MdOutlineKeyboardArrowRight
              className={`text-lg group-hover:text-gray-100 transition ${
                membersOpen ? "rotate-90" : "rotate-0"
              }`}
              onClick={() => setMembersOpen(!membersOpen)}
            />
            <span
              className="flex-1 group-hover:text-gray-100 text-gray-200 text-sm uppercase font-semibold"
              onClick={() => setMembersOpen(!membersOpen)}
            >
              Members
            </span>
          </div>
          <a.ul
            className={`font-noto text-sm text-gray-200 flex flex-col gap-2 transition-colors overflow-hidden`}
            style={membersOpenToggleSpring}
          >
            {project?.team.map((member, index) => (
              <a.li
                key={member._id}
                className="p-1 px-2 rounded flex items-center gap-2 bg-gray-825 transition-colors select-none cursor-default capitalize hover:bg-gray-800 mx-2"
                style={membersOpenTrail[index]}
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
              </a.li>
            ))}
          </a.ul>
          {!project?.team.length && (
            <p className="p-1 px-2 rounded text-sm flex font-normal items-center gap-2 select-none cursor-default">
              No team members assigned
            </p>
          )}
        </div>
        {user?._id === project?.author._id ? (
          <div className="invitees-drop font-noto">
            <div className=" flex items-center gap-0 cursor-pointer group transition-all select-none relative h-8 mb-1">
              <MdOutlineKeyboardArrowRight
                className={`text-lg group-hover:text-gray-100 transition ${
                  invitedMembersOpen ? "rotate-90" : "rotate-0"
                }`}
                onClick={() => setInvitedMembersOpen(!invitedMembersOpen)}
              />
              <span
                className="flex-1 group-hover:text-gray-100 text-gray-200 text-sm uppercase font-semibold"
                onClick={() => setInvitedMembersOpen(!invitedMembersOpen)}
              >
                Invited Members
              </span>
              <BsPlus
                className="text-2xl bg-orange-500 text-white hover:bg-orange-600 rounded-full transition-colors mr-2"
                id="assign-members"
                onClick={() => {
                  if (project) setAssignOpen(true);
                }}
              />
              <Tooltip anchorId="assign-members" content="Invite Members" />
            </div>
            <a.ul
              className={`font-noto text-sm text-gray-200 flex flex-col gap-2 overflow-hidden transition-colors`}
              style={invitedMembersOpenToggleSpring}
            >
              {project?.invitees.map(({ user: member }, index) => (
                <a.li
                  key={member._id}
                  className="p-1 px-2 rounded flex items-center gap-2 bg-gray-825 transition-colors select-none cursor-default capitalize hover:bg-gray-800 mx-2"
                  style={invitedMembersOpenTrail[index]}
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
                </a.li>
              ))}
            </a.ul>
            {!project?.team.length && (
              <p className="p-1 px-2 rounded text-sm flex font-normal items-center gap-2 select-none cursor-default">
                No team members assigned
              </p>
            )}
          </div>
        ) : null}
      </div>

      {project && (
        <>
          <ProjectDetailsOptionsPopup
            setProjectDeleteOpen={setProjectDeleteOpen}
            setTicketCreateOpen={setTicketCreateOpen}
            setProjectAssignOpen={setAssignOpen}
            open={optionsOpen}
            setOpen={setOptionsOpen}
            project={project}
            method={method}
          />
          <ProjectInviteModal
            open={assignOpen}
            setOpen={setAssignOpen}
            project={project}
            loading={loading}
            method={method}
          />
        </>
      )}
    </aside>
  );
};

export default ProjectDetailsBar;
