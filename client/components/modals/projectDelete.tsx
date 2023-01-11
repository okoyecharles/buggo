import { toast } from "react-toastify";
import { deleteProject } from "../../redux/actions/projectActions";
import store from "../../redux/configureStore";
import { Project } from "../../redux/reducers/projects/types";
import { useEffect } from "react";
import Modal from ".";
import moment from "moment";
import Loader from "../Loader";

const ProjectDeletePopup: React.FC<{
  open: boolean;
  setOpen: any;
  project: Project;
  loading: boolean;
  method: {
    [key: string]: any;
  };
}> = ({ open, setOpen, project, loading, method }) => {
  const handleDelete = () => {
    store.dispatch(deleteProject(project._id));
    toast.success("Project deleted successfully");
  };

  useEffect(() => {
    if (open && loading === false && !method.delete) {
      setOpen(false);
    }
  }, [loading, method]);

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="p-4">
        <header className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white">Delete Project</h2>
          <p className="text-gray-200 mb-4">
            Are you sure you want to delete this project?
          </p>
        </header>
        <div className="shadow-lg gap-2 bg-gray-700 p-2 rounded mb-2">
          <p className="text-sm text-blue-500">{moment(project.createdAt).calendar()}</p>
          <p className="font-semibold text-gray-100">{project.title}</p>
        </div>
        <p className="text-gray-400 text-sm mb-2">
          This action will delete all tickets and comments associated with this
          project.
        </p>
      </div>
      <div className="flex gap-2 bg-gray-850 p-4 py-3 justify-end">
        <button
          className="px-6 p-2 hover:underline text-white font-semibold"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-6 p-2 bg-red-500 text-red-50 rounded-sm font-semibold hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-75"
          disabled={loading && method.delete}
          onClick={handleDelete}
        >
          {loading && method.delete ? <Loader /> : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default ProjectDeletePopup;