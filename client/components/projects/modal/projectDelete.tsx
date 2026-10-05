import { toast } from "react-toastify";
import { deleteProject } from "@/redux/actions/projectActions";
import store, { storeType } from "@/redux/configureStore";
import { useSelector } from "react-redux";
import { Project } from "@/core/types/models";
import Modal from "@/core/components/modal";
import moment from "moment";
import { ThreeDotsLoader } from "@/core/components/loader";
import getDate from "@/core/utils/strings/date";
import { useRouter } from "next/router";

const ProjectDeleteModal: React.FC<{
  open: boolean;
  setOpen: any;
  project: Project | null;
}> = ({ open, setOpen, project }) => {
  const deleting = useSelector(
    (store: storeType) => store.project.pending.delete,
  );
  const router = useRouter();

  const handleDelete = async () => {
    if (!project) return;
    const ok = await store.dispatch(deleteProject(project._id));
    if (ok) {
      toast.success("Project deleted successfully");
      setOpen(false);
      router.replace("/dashboard");
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="p-4">
        <header className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-white">Delete Project</h2>
          <p className="text-gray-200 mb-4">
            Are you sure you want to delete this project?
          </p>
        </header>
        <div className="shadow-lg gap-2 bg-gray-700 p-2 rounded mb-2">
          <p className="text-sm text-blue-400 capitalize">
            {getDate(project?.createdAt)}
          </p>
          <p className="font-semibold text-gray-100">{project?.title}</p>
        </div>
        <p className="text-gray-400 text-xsm mb-2">
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
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? <ThreeDotsLoader /> : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default ProjectDeleteModal;
