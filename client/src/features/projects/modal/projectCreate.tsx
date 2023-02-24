import React, { FormEvent, useEffect, useState } from "react";
import { createProject } from "../../../../redux/actions/projectActions";
import store from "../../../../redux/configureStore";
import Modal from "../../modal";
import { IoMdClose } from "react-icons/io";
import { ThreeDotsLoader } from "../../loader";

const CreateProjectModal = ({
  open,
  setOpen,
  loading,
  method,
}: {
  open: boolean;
  setOpen: any;
  loading: boolean;
  method: {
    [key: string]: any;
  };
}) => {
  const [title, setTitle] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTitleError(null);

    if (!title) {
      setTitleError("Title is required");
      return;
    }

    if (title.length < 5) {
      setTitleError("Title must be at least 5 characters");
      return;
    }

    if (title.length > 25) {
      setTitleError("Title must be less than 25 characters");
      return;
    }

    const projectData = { title };
    store.dispatch(createProject(projectData));
  };

  // Close modal if project has been created
  useEffect(() => {
    if (open && loading === false && !method.create) {
      setOpen(false);
      setTitle("");
      setTitleError(null);
    }
  }, [method.create]);

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
            htmlFor="name"
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
            id="name"
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
          disabled={loading && method.create}
          type="submit"
        >
          {loading && method.create ? <ThreeDotsLoader /> : "Create"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
