import React, { KeyboardEvent, useEffect, useMemo, useState } from "react";
import {
  BsFillPencilFill,
  BsFillPersonCheckFill,
  BsFillTrashFill,
  BsThreeDots,
} from "react-icons/bs";
import { AiFillClockCircle } from "react-icons/ai";
import { Tooltip } from "react-tooltip";
import { IoTicket } from "react-icons/io5";
import Pluralize from "react-pluralize";
import { Project } from "../../../types/models";
import { useSelector } from "react-redux";
import store, { storeType } from "../../../../redux/configureStore";
import { updateProject } from "../../../../redux/actions/projectActions";
import ProjectDeleteModal from "../modal/projectDelete";
import { restrictLength } from "../../../utils/components/string";
import ProjectInviteModal from "../modal/projectInvite";
import ProjectOptionsPopup from "./Options";
import ProjectCardMembers from "./Members";
import Highlighter from "react-highlight-words";
import getDate from "../../../utils/strings/date";
import Authorized from "../../../utils/authorization";
import { useRouter } from "next/router";
import { a } from "@react-spring/web";

interface projectProps {
  project: Project;
  loading: boolean;
  search: string;
  method: {
    [key: string]: any;
  };
  currentEdit: string;
  setCurrentEdit: (id: string) => void;
  projectCardTrail: any
}

const ProjectCard: React.FC<projectProps> = ({
  project,
  loading,
  search,
  method,
  currentEdit,
  setCurrentEdit,
  projectCardTrail
}) => {
  const user = useSelector((store: storeType) => store.currentUser.user);
  const router = useRouter();

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [projectDeleteConfirm, setProjectDeleteConfirm] = useState(false);
  const [projectInvite, setProjectInvite] = useState(false);

  const editInputRef = React.useRef<HTMLInputElement>(null);

  // Disable edit while editing another project
  useEffect(() => {
    if (project._id !== currentEdit && editMode) {
      setEditMode(false);
    }
  }, [currentEdit]);

  const handleInviteMembers = async () => {
    setProjectInvite(true);
  };

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

  const isAuthorized = useMemo(() => {
    return Authorized("project", "update", user, project);
  }, [user, project]);

  return (
    <a.li
      key={project._id}
      className={`project flex flex-col bg-gray-850 p-4 group hover:bg-gray-900 rounded relative cursor-pointer`}
      style={projectCardTrail}
      onClick={() => {
        router.push(`/project/${project._id}`);
      }}
    >
      <h2
        className={`font-bold text-gray-200 font-noto text-xl mb-2 ${
          editMode ? "hidden" : ""
        }`}
      >
        <Highlighter
          autoEscape={true}
          textToHighlight={restrictLength(project.title, 25)}
          searchWords={[search]}
          highlightClassName="bg-orange-500/75 text-white"
        />
      </h2>
      <div
        className={`relative mb-2 ${editMode ? "" : "hidden"}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
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
              if (project.title !== editTitle && editTitle.length >= 5)
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
      <ProjectCardMembers project={project} />
      <div className="flex flex-col lg:flex-row lg:mt-0  lg:gap-4">
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
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {isAuthorized && (
          <>
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
              id={`invite-project-${project._id}`}
              className="hidden lg:flex h-full hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square items-center justify-center transition-colors disabled:opacity-50"
              tabIndex={-1}
              onClick={handleInviteMembers}
              disabled={loading && method.update}
            >
              <BsFillPersonCheckFill />
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
        anchorId={`invite-project-${project._id}`}
        content="Invite Members"
      />
      <Tooltip anchorId={`delete-project-${project._id}`} content="Delete" />
      <ProjectOptionsPopup
        open={optionsOpen}
        loading={loading}
        method={method}
        setOpen={setOptionsOpen}
        setProjectDeleteConfirm={setProjectDeleteConfirm}
        handleEditMode={handleEditMode}
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
    </a.li>
  );
};

export default ProjectCard;
