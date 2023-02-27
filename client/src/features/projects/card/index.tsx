import React, { KeyboardEvent, useEffect, useState } from "react";
import {
  BsFillPencilFill,
  BsFillPersonCheckFill,
  BsFillTrashFill,
  BsPersonDashFill,
  BsPersonPlusFill,
  BsThreeDots,
} from "react-icons/bs";
import { AiFillClockCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { IoTicket } from "react-icons/io5";
import Pluralize from "react-pluralize";
import { Project } from "../../../types/models";
import { useSelector } from "react-redux";
import store, { storeType } from "../../../../redux/configureStore";
import {
  getProjectTeamIds,
  updateProject,
} from "../../../../redux/actions/projectActions";
import ProjectDeleteModal from "../modal/projectDelete";
import { restrictLength } from "../../../utils/stringHelper";
import ProjectInviteModal from "../modal/projectInvite";
import ProjectOptionsPopup from "./Options";
import ProjectCardMembers from "./Members";
import Highlighter from "react-highlight-words";
import Link from "next/link";
import getDate from "../../../utils/dateHelper";

interface projectProps {
  project: Project;
  loading: boolean;
  search: string;
  method: {
    [key: string]: any;
  };
  currentEdit: string;
  setCurrentEdit: (id: string) => void;
}

const ProjectCard: React.FC<projectProps> = ({
  project,
  loading,
  search,
  method,
  currentEdit,
  setCurrentEdit,
}) => {
  const user = useSelector((store: storeType) => store.currentUser.user);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const editInputRef = React.useRef<HTMLInputElement>(null);

  const [projectDeleteConfirm, setProjectDeleteConfirm] = useState(false);

  const [projectInvite, setProjectInvite] = useState(false);

  // Disable edit while editing another project
  useEffect(() => {
    if (project._id !== currentEdit && editMode) {
      setEditMode(false);
    }
  }, [currentEdit]);

  const handleAssignMembers = async () => {
    setProjectInvite(true);
  };

  async function handleAssign() {
    const previousTeam: string[] = await getProjectTeamIds(project);

    if (isInTeam(project)) {
      store.dispatch(
        updateProject({
          id: project._id,
          project: {
            team: previousTeam.filter(
              (id: string) => id !== user?._id
            ),
          },
        })
      );
    } else {
      if (previousTeam.includes(user?._id as string)) {
        store.dispatch(
          updateProject({
            id: project._id,
            project: {
              team: previousTeam,
            },
          })
        );
      } else {
        store.dispatch(
          updateProject({
            id: project._id,
            project: {
              team: [...previousTeam, user?._id],
            },
          })
        );
      }
    }
  }

  function handleEditMode() {
    setEditMode(true);
    setCurrentEdit(project._id);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  }

  const editProject = (id: string, fields: any) => {
    store.dispatch(
      updateProject({
        id,
        project: fields,
      })
    );
    setEditMode(false);
  };

  const isInTeam = (project: any) => {
    return !!project.team.filter(
      (member: any) => member._id === user?._id
    ).length;
  };

  return (
    <article
      key={project._id}
      className="project flex flex-col bg-gray-850 p-4 group hover:bg-gray-900 rounded relative"
    >
      <Link
        href={`/project/${project._id}`}
        className={`font-bold text-gray-200 font-noto text-xl group-hover:underline cursor-pointer mb-2 ${
          editMode ? "hidden" : ""
        }`}
      >
        <Highlighter
          autoEscape={true}
          textToHighlight={restrictLength(project.title, 25)}
          searchWords={[search]}
          highlightClassName="bg-orange-500/75 text-white"
        />
      </Link>
      <div className={`relative mb-2 ${editMode ? "" : "hidden"}`}>
        <input
          type="text"
          ref={editInputRef}
          className="p-1 text-lg font-bold bg-gray-800 rounded outline-none text-gray-200 w-full "
          value={editTitle}
          onChange={(e) => {
            setEditTitle(e.target.value);
          }}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === "Enter") {
              if (project.title !== editTitle)
                editProject(project._id, { title: editTitle });
              setEditMode(false);
            }
            if (event.key === "Escape") {
              setEditMode(false);
            }
          }}
        />
        <div className="helper text-xsm hidden lg:block">
          escape to{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              setEditMode(false);
            }}
          >
            cancel
          </span>{" "}
          • enter to{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => {
              editProject(project._id, { title: editTitle });
              setEditMode(false);
            }}
          >
            save
          </span>
        </div>
        <button className="lg:hidden">
          <BsFillPencilFill
            className="absolute right-1 top-1/2 -translate-y-1/2 text-2xl p-1 bg-orange-500 text-orange-100 hover:bg-orange-600 transition-colors rounded"
            onClick={() => {
              editProject(project._id, { title: editTitle });
              setEditMode(false);
            }}
          />
        </button>
      </div>
      <ProjectCardMembers
        project={project}
        handleAssign={handleAssign}
        isInTeam={isInTeam}
        loading={loading}
        method={method}
      />
      <div className="flex flex-col mt-4 lg:flex-row lg:mt-0  lg:gap-4">
        <div className="text-gray-500 uppercase text-xsm flex items-center gap-2">
          <AiFillClockCircle className="text-orange-400" />
          {getDate(project.createdAt, { format: "from now" })}
        </div>
        <div className="text-gray-500 uppercase text-xsm flex items-center gap-2">
          <IoTicket className="text-orange-400" />{" "}
          <Pluralize singular={"ticket"} count={project.tickets.length} />
        </div>
        <p className="uppercase lg:ml-auto text-orange-500/90 text-xsm font-semibold">
          By {project.author.name}
        </p>
      </div>
      <div
        className={`options flex bg-gray-800 absolute rounded bottom-4 lg:top-4 right-4 h-8 hover:shadow-lg overflow-hidden transition-all lg:opacity-0 lg:pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto w-fit self-end ${
          editMode ? "hidden" : ""
        }`}
      >
        {user?._id === project.author._id && (
          <>
            <button
              id={`assign-self-${project._id}`}
              className="hidden lg:flex h-full hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square items-center justify-center transition-colors disabled:opacity-50"
              tabIndex={-1}
              onClick={handleAssign}
              disabled={loading && method.update}
            >
              {isInTeam(project) ? <BsPersonDashFill /> : <BsPersonPlusFill />}
            </button>
            <button
              id={`invite-project-${project._id}`}
              className="hidden lg:flex h-full hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square items-center justify-center transition-colors disabled:opacity-50"
              tabIndex={-1}
              onClick={handleAssignMembers}
              disabled={loading && method.update}
            >
              <BsFillPersonCheckFill />
            </button>
            <button
              id={`edit-project-${project._id}`}
              className="hidden lg:flex h-full hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square items-center justify-center transition-colors disabled:opacity-50"
              disabled={loading && method.update}
              tabIndex={-1}
              onClick={handleEditMode}
            >
              <BsFillPencilFill />
            </button>
            <button
              id={`delete-project-${project._id}`}
              className="hidden lg:flex h-full 
                      lg:hover:bg-red-500 hover:bg-orange-500 
                      lg:active:bg-red-600 active:bg-orange-600 
                      lg:hover:text-red-100 hover:text-orange-50
                      lg:text-red-500/90 text-orange-500 
                      aspect-square items-center justify-center transition-colors"
              tabIndex={-1}
              onClick={() => setProjectDeleteConfirm(true)}
            >
              <BsFillTrashFill />
            </button>
            <button
              className="h-full lg:hidden hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square flex items-center justify-center transition"
              onClick={() => {
                setOptionsOpen(true);
              }}
            >
              <BsThreeDots />
            </button>
          </>
        )}
      </div>
      <Tooltip anchorId={`edit-project-${project._id}`} content="Edit" />
      <Tooltip
        anchorId={`assign-self-${project._id}`}
        content={isInTeam(project) ? "Remove Yourself" : "Assign Yourself"}
      />
      <Tooltip
        anchorId={`invite-project-${project._id}`}
        content="Invite Members"
      />
      <Tooltip anchorId={`delete-project-${project._id}`} content="Delete" />
      <ProjectOptionsPopup
        open={optionsOpen}
        project={project}
        loading={loading}
        method={method}
        setOpen={setOptionsOpen}
        setProjectDeleteConfirm={setProjectDeleteConfirm}
        handleEditMode={handleEditMode}
        handleAssign={handleAssign}
        setProjectAssign={setProjectInvite}
      />
      <ProjectInviteModal
        open={projectInvite}
        setOpen={setProjectInvite}
        project={project}
        loading={loading}
        method={method}
      />
      <ProjectDeleteModal
        open={projectDeleteConfirm}
        setOpen={setProjectDeleteConfirm}
        project={project}
        loading={loading}
        method={method}
      />
    </article>
  );
};

export default ProjectCard;
