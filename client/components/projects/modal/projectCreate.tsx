import React, { FormEvent, useEffect, useState } from "react";
import { createProject } from "@/redux/actions/projectActions";
import store, { storeType } from "@/redux/configureStore";
import { useSelector } from "react-redux";
import { validateProjectTitle } from "@/core/utils/validation/project";
import Modal from "@/core/components/modal";
import { IoMdClose } from "react-icons/io";
import { ThreeDotsLoader } from "@/core/components/loader";
import { toast } from "react-toastify";

const CreateProjectModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) => {
  const creating = useSelector(
    (store: storeType) => store.projects.pending.create,
  );
  const [title, setTitle] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTitleError(null);

    const titleValidationError = validateProjectTitle(title);
    if (titleValidationError) {
      setTitleError(titleValidationError);
      return;
    }

    const projectData = { title };
    const ok = await store.dispatch(createProject(projectData));
    if (ok) {
      toast.success("Project created successfully");
      setOpen(false);
      setTitle("");
      setTitleError(null);
    }
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setTitleError(null);
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <header className="header flex justify-between items-center">
        <h3 className="text-lg text-gray-100 font-semibold">
          Create a Project
        </h3>
        <button
          name="close modal"
          className="p-1 text-2xl text-gray-400 hover:text-gray-200 rounded-full transition-all focus:outline-none active:bg-gray-700"
          onClick={() => {
            setOpen(false);
          }}
        >
          <IoMdClose />
        </button>
      </header>

      <form action="" className="flex flex-col" onSubmit={handleSubmit}>
        <div className="flex flex-col mt-4">
          <label
            htmlFor="project-title"
            className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
              titleError && "text-red-300"
            }`}
          >
            Title {titleError && <span className="text-red-300"> - </span>}
            <span className="capitalize font-normal italic text-red-300">
              {titleError ? `${titleError}` : ""}
            </span>
          </label>
          <input
            type="text"
            id="project-title"
            ref={inputRef}
            name="name"
            placeholder="eg. Limitless horizons"
            className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <p className="text-xsm">You can invite members after creation.</p>
        </div>

        <button
          className="font-open font-semibold px-4 py-2 text-ss mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 hover:text-blue-100 disabled:opacity-80 disabled:cursor-not-allowed  transition flex justify-center"
          disabled={creating}
          type="submit"
        >
          {creating ? <ThreeDotsLoader /> : "Create"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
