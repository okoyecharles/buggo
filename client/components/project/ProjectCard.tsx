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
import Image from "next/image";
import moment from "moment";
import Pluralize from "react-pluralize";
import { Project } from "../../redux/reducers/projects/types";
import { useSelector } from "react-redux";
import store, { storeType } from "../../redux/configureStore";
import { useSpring, a } from "@react-spring/web";
import {
  getProjectTeamIds,
  updateProject,
} from "../../redux/actions/projectActions";
import ProjectDeletePopup from "../modals/projectDelete";
import { restrictLength } from "../../utils/stringHelper";
import Modal from "../modals";
import ProjectAssignPopup from "../modals/projectAssign";

interface projectProps {
  project: Project;
  loading: boolean;
  method: {
    [key: string]: any;
  };
  currentEdit: string;
  setCurrentEdit: (id: string) => void;
}

const ProjectCard: React.FC<projectProps> = ({
  project,
  loading,
  method,
  currentEdit,
  setCurrentEdit,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsPos, setOptionsPos] = useState(0);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const editInputRef = React.useRef<HTMLInputElement>(null);

  const [projectDeleteConfirm, setProjectDeleteConfirm] = useState(false);

  const [projectAssign, setProjectAssign] = useState(false);

  // Disable edit while editing another project
  useEffect(() => {
    if (project._id !== currentEdit && editMode) {
      setEditMode(false);
    }
  }, [currentEdit]);

  const handleAssignMembers = async () => {
    setProjectAssign(true);
  };

  async function handleAssign() {
    const previousTeam: string[] = await getProjectTeamIds(project);

    if (isInTeam(project)) {
      store.dispatch(
        updateProject({
          id: project._id,
          project: {
            team: previousTeam.filter(
              (id: string) => id !== currentUser?.user._id
            ),
          },
        })
      );
    } else {
      if (previousTeam.includes(currentUser?.user._id as string)) {
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
              team: [...previousTeam, currentUser?.user._id],
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
      (member: any) => member._id === currentUser?.user._id
    ).length;
  };

  return (
    <article
      key={project._id}
      className="project flex flex-col bg-gray-850 p-4 group hover:bg-gray-900 rounded relative"
    >
      <h4
        className={`font-bold text-gray-200 font-noto text-xl mb-2 ${
          editMode ? "hidden" : ""
        }`}
      >
        {restrictLength(project.title, 25)}
      </h4>
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
      <div className="flex mb-2 gap-2 lg:items-center text-ss lg:h-7">
        <h4 className="font-bold text-gray-400 flex items-center">MEMBERS:</h4>
        <div className="flex gap-2 items-center h-7">
          {project.team.length ? (
            project.team.map((member) => (
              <Image
                src={member.image}
                alt={member.name}
                width={28}
                height={28}
                className="h-full rounded-full ring-1 ring-orange-500/50"
              />
            ))
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
            ""
          )
        }
      </div>
      <div className="flex flex-col mt-4 lg:flex-row lg:mt-0  lg:gap-4">
        <p className="text-gray-500 uppercase text-xsm flex items-center gap-2">
          <AiFillClockCircle className="text-orange-400" />
          {moment(project.createdAt).fromNow()}
        </p>
        <p className="text-gray-500 uppercase text-xsm flex items-center gap-2">
          <IoTicket className="text-orange-400" />{" "}
          <Pluralize singular={"ticket"} count={project.tickets.length} />
        </p>
        <p className="uppercase lg:ml-auto text-orange-500/90 text-xsm font-semibold">
          By {project.author.name}
        </p>
      </div>
      <div
        className={`options flex bg-gray-800 absolute rounded bottom-4 lg:top-4 right-4 h-8 hover:shadow-lg overflow-hidden transition-all lg:opacity-0 lg:pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto w-fit self-end ${
          editMode ? "hidden" : ""
        }`}
      >
        <button
          id={`assign-self-${project._id}`}
          className="hidden lg:flex h-full hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square items-center justify-center transition-colors disabled:opacity-50"
          tabIndex={-1}
          onClick={handleAssign}
          disabled={loading && method.update}
        >
          {isInTeam(project) ? <BsPersonDashFill /> : <BsPersonPlusFill />}
        </button>

        {currentUser?.user._id === project.author._id && (
          <>
            <button
              id={`assign-project-${project._id}`}
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
          </>
        )}
        <button
          className="h-full lg:hidden hover:bg-gray-700 active:bg-gray-750 hover:text-white aspect-square flex items-center justify-center transition"
          onClick={(e) => {
            setOptionsPos(e.clientY);
            setOptionsOpen(true);
          }}
        >
          <BsThreeDots />
        </button>
      </div>
      <Tooltip anchorId={`edit-project-${project._id}`} content="Edit" />
      <Tooltip
        anchorId={`assign-self-${project._id}`}
        content={isInTeam(project) ? "Remove Yourself" : "Assign Yourself"}
      />
      <Tooltip
        anchorId={`assign-project-${project._id}`}
        content="Assign Members"
      />
      <Tooltip anchorId={`delete-project-${project._id}`} content="Delete" />
      <ProjectOptionsPopup
        open={optionsOpen}
        project={project}
        loading={loading}
        method={method}
        setOpen={setOptionsOpen}
        pos={optionsPos}
        setProjectDeleteConfirm={setProjectDeleteConfirm}
        handleEditMode={handleEditMode}
        handleAssign={handleAssign}
        setProjectAssign={setProjectAssign}
      />
      <ProjectAssignPopup
        open={projectAssign}
        setOpen={setProjectAssign}
        project={project}
        loading={loading}
        method={method}
      />
      <ProjectDeletePopup
        open={projectDeleteConfirm}
        setOpen={setProjectDeleteConfirm}
        project={project}
        loading={loading}
        method={method}
      />
    </article>
  );
};

const ProjectOptionsPopup: React.FC<{
  open: boolean;
  project: Project;
  loading: boolean;
  method: any;
  setOpen: any;
  setProjectDeleteConfirm: any;
  handleEditMode: any;
  handleAssign: any;
  setProjectAssign: any;
  pos: number;
}> = ({
  open,
  project,
  loading,
  method,
  setOpen,
  handleAssign,
  pos,
  handleEditMode,
  setProjectDeleteConfirm,
  setProjectAssign,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const isInTeam = (project: any) => {
    return !!project.team.filter(
      (member: any) => member._id === currentUser?.user._id
    ).length;
  };

  const spring = useSpring({
    opacity: 0,
    y: -10,
    scale: 0.8,
    to: {
      opacity: open ? 1 : 0,
      y: open ? 0 : -10,
      scale: open ? 1 : 0.8,
    },
    config: {
      tension: 350,
      friction: 25,
    },
  });

  return (
    <a.div
      className={`projectOptionsPopup absolute top-4 right-4 w-48 bg-gray-950 shadow-lg shadow-gray-950/40 rounded-md p-2 z-40 isolate`}
      style={{
        ...spring,
        pointerEvents: open ? "all" : "none",
      }}
    >
      <div
        className={open ? "fixed top-0 left-0 h-screen w-screen -z-10" : ""}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className="flex flex-col gap-1">
        <button
          id={`remove-self-${project._id}`}
          className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
          onClick={() => {
            handleAssign();
            setOpen(false);
          }}
          disabled={loading && method.update}
        >
          {isInTeam(project) ? (
            <>
              Remove Yourself <BsPersonDashFill />
            </>
          ) : (
            <>
              Assign Yourself <BsPersonPlusFill />
            </>
          )}
        </button>
        {currentUser?.user._id === project.author._id && (
          <>
            <button
              className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
              disabled={loading && method.update}
              onClick={() => {
                setProjectAssign(true);
                setOpen(false);
              }}
            >
              Assign Members
              <BsFillPersonCheckFill />
            </button>

            <button
              className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700 hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
              disabled={loading && method.update}
              onClick={() => {
                setOpen(false);
                handleEditMode();
              }}
            >
              Edit Project
              <BsFillPencilFill />
            </button>

            <button
              className="p-2 group text-red-500 hover:bg-red-500 active:bg-red-600 hover:text-red-50 flex justify-between items-center transition-colors rounded-sm text-sm"
              onClick={() => setProjectDeleteConfirm(true)}
            >
              Delete Project
              <BsFillTrashFill />
            </button>
          </>
        )}
      </div>
    </a.div>
  );
};

export default ProjectCard;
