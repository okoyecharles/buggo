import { useMemo, useState } from "react";
import { Project } from "@/core/types/models";
import { useSelector } from "react-redux";
import store, { storeType } from "@/redux/configureStore";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { FiCheckCircle } from "react-icons/fi";
import getDate from "@/core/utils/strings/date";
import Image from "next/image";
import { BsPlus } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import ProjectDetailsOptionsPopup from "./Options";
import ProjectInviteModal from "@/components/projects/modal/projectInvite";
import Button from "@/core/components/button";
import { acceptInvite } from "@/redux/actions/projectActions";
import { a, useSpring, useTrail } from "@react-spring/web";
import getAuthorization from "@/core/utils/authorization";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface ProjectDetailsBarProps {
  project: Project | null;
  setTicketCreateOpen: any;
  setProjectDeleteOpen: any;
}

const ProjectDetailsBar: React.FC<ProjectDetailsBarProps> = ({
  project,
  setTicketCreateOpen,
  setProjectDeleteOpen,
}) => {
  const [membersOpen, setMembersOpen] = useState(true);
  const [invitedMembersOpen, setInvitedMembersOpen] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const router = useRouter();

  const user = useSelector((store: storeType) => store.currentUser.user);
  const pending = useSelector((store: storeType) => store.project.pending);

  const isAuthorized = useMemo(() => {
    return getAuthorization("project", "update", user, project);
  }, [user, project]);

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
    height: invitedMembersOpen
      ? `${(project?.invitees.length || 0) * (32 + 8)}px`
      : "0px",
    config: {
      tension: 400,
      friction: 40,
    },
  });

  return (
    <aside className="project-details-bar w-full lg:w-60 bg-gray-850 lg:relative z-30">
      {/* Project details header */}
      <div
        className="
         shadow-sm shadow-gray-950 text-gray-300 transition-colors bg-gray-850 z-10 hover:bg-gray-825 hover:text-gray-100 sticky top-[64px] w-full
        "
      >
        <div className="relative flex items-center h-16 gap-[1ch]">
          <button
						aria-label="Back to dashboard"
            className="rounded p-1 bg-gray-900 active:bg-gray-950 transition-colors shadow-sm lg:hidden ml-3"
            onClick={() => router.push("/dashboard")}
          >
            <IoIosArrowBack className="text-2xl text-white" />
          </button>
          <h2 className="truncate font-bold text-gray-100 text-lg flex flex-1 h-full">
            <button
              className="flex items-center justify-between gap-2 w-full px-3"
              onClick={() => {
                if (!isAuthorized) return;
                setOptionsOpen(!optionsOpen);
              }}
              aria-label="Project options"
              aria-expanded={optionsOpen}
            >
              <span>{project?.title}</span>
              {isAuthorized && (
                <span className="relative w-6 h-6" aria-hidden>
                  <MdOutlineKeyboardArrowDown
                    className={`text-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
                      optionsOpen
                        ? "rotate-180 opacity-0"
                        : "rotate-0 opacity-1"
                    } transition-all`}
                  />
                  <IoMdClose
                    className={`text-xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
                      optionsOpen
                        ? "rotate-0 opacity-1"
                        : "-rotate-180 opacity-0"
                    } transition-all`}
                  />
                </span>
              )}
            </button>
          </h2>
          {project && (
            <ProjectDetailsOptionsPopup
              setProjectDeleteOpen={setProjectDeleteOpen}
              setTicketCreateOpen={setTicketCreateOpen}
              setProjectAssignOpen={setAssignOpen}
              open={optionsOpen}
              setOpen={setOptionsOpen}
              project={project}
            />
          )}
        </div>
      </div>

      {/* Project details content */}
      <div className="project-info p-3 px-1 text-gray-300 flex flex-col">
        <p className="text-gray-400 px-2 text-sm mb-2">
          {`Created ${getDate(project?.createdAt, {
            format: "on calendar",
          })}`}
        </p>

        {project?.invitees.some((i) => i.user._id === user?._id) && (
          <Button
            overrideStyle="mx-1"
            onClick={async () => {
              const ok = await store.dispatch(acceptInvite(project._id));
              if (ok) toast.success("Invitation accepted successfully");
            }}
            processing={pending.acceptInvite}
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
        {isAuthorized ? (
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
        <ProjectInviteModal
          open={assignOpen}
          setOpen={setAssignOpen}
          project={project}
        />
      )}
    </aside>
  );
};

export default ProjectDetailsBar;
