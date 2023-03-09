import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import { IoMdClose } from "react-icons/io";
import {
  validateTicketDescription,
  validateTicketPriority,
  validateTicketTimeEstimate,
  validateTicketTitle,
  validateTicketType,
} from "../../../utils/forms/ticket";
import store from "../../../../redux/configureStore";
import { createTicket } from "../../../../redux/actions/ticketActions";
import { useRouter } from "next/router";
import { ThreeDotsLoader } from "../../loader";

interface CreateTicketModalProps {
  open: boolean;
  setOpen: any;
  loading: boolean;
  method: any;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  open,
  setOpen,
  loading,
  method,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [timeEstimate, setTimeEstimate] = useState<number | string>("");

  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [priorityError, setPriorityError] = useState<string | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);
  const [timeEstimateError, setTimeEstimateError] = useState<string | null>(
    null
  );

  const [processing, setProcessing] = useState<boolean>(false);
  const { query } = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setTitleError(null);
    setDescriptionError(null);
    setPriorityError(null);
    setTypeError(null);
    setTimeEstimateError(null);

    // Validate title
    let titleValidationError = validateTicketTitle(title);
    if (titleValidationError) setTitleError(titleValidationError);

    // Validate description
    let descriptionValidationError = validateTicketDescription(description);
    if (descriptionValidationError)
      setDescriptionError(descriptionValidationError);

    // Validate priority
    let priorityValidationError = validateTicketPriority(priority);
    if (priorityValidationError) setPriorityError(priorityValidationError);

    // Validate type
    let typeValidationError = validateTicketType(type);
    if (typeValidationError) setTypeError(typeValidationError);

    // Validate time estimate
    let timeEstimateValidationError = validateTicketTimeEstimate(timeEstimate);
    if (timeEstimateValidationError)
      setTimeEstimateError(timeEstimateValidationError);

    if (
      titleValidationError ||
      descriptionValidationError ||
      priorityValidationError ||
      typeValidationError ||
      timeEstimateValidationError
    ) {
      return;
    }

    // Create ticket
    store.dispatch(
      createTicket(
        {
          title,
          description,
          priority,
          type,
          time_estimate: timeEstimate,
          status: "open",
        },
        query.id as string
      )
    );
  };

  useEffect(() => {
    setProcessing(loading && method.createTicket);

    if (open && !method.createTicket && !loading) {
      setOpen(false);
    }
  }, [loading, method]);

  useEffect(() => {
    if (open) {
      // Clear form
      setTitle("");
      setDescription("");
      setPriority("");
      setType("");
      setTimeEstimate("");

      // Clear errors
      setTitleError(null);
      setDescriptionError(null);
      setPriorityError(null);
      setTypeError(null);
      setTimeEstimateError(null);
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen}>
      <header className="header flex justify-between items-center">
        <h3 className="text-lg text-gray-100 font-semibold">Create a Ticket</h3>
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
            htmlFor="ticket-title"
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
            id="ticket-title"
            name="title"
            placeholder="eg. Fix header section"
            className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="flex flex-col mt-2 relative">
          <label
            htmlFor="description"
            className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
              descriptionError && "text-red-300"
            }`}
          >
            Description{" "}
            {descriptionError && <span className="text-red-300"> - </span>}
            <span className="capitalize font-normal italic text-red-300">
              {descriptionError ? `${descriptionError}` : ""}
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="What needs to be done?"
            className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2 resize-none"
            value={description}
            rows={4}
            onChange={(event) => setDescription(event.target.value)}
          />
          <span
            className={`${
              description.length > 500 ? "text-red-400" : "text-blue-400"
            } text-sm font-bold absolute -bottom-4 right-1`}
          >
            {description.length}/500
          </span>
        </div>

        <div className="flex gap-2 mt-2">
          <div className="flex flex-col flex-1">
            <label
              htmlFor="ticket-priority"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                priorityError && "text-red-300"
              }`}
            >
              Priority{" "}
              {priorityError && <span className="text-red-300"> - </span>}
              <span className="capitalize font-normal italic text-red-300">
                {priorityError ? `${priorityError}` : ""}
              </span>
            </label>
            <select
              name="priority"
              id="ticket-priority"
              className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2 flex-1"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex flex-col flex-1">
            <label
              htmlFor="ticket-type"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                typeError && "text-red-300"
              }`}
            >
              Type {typeError && <span className="text-red-300"> - </span>}
              <span className="capitalize font-normal italic text-red-300">
                {typeError ? `${typeError}` : ""}
              </span>
            </label>
            <select
              name="type"
              id="ticket-type"
              className="text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2 flex-1"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">Select</option>
              <option value="issue">Issue</option>
              <option value="feature">Feature</option>
              <option value="bug">Bug</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col mt-4">
          <label
            htmlFor="ticket-time-estimate"
            className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
              timeEstimateError && "text-red-300"
            }`}
          >
            Time estimate (in hours){" "}
            {timeEstimateError && <span className="text-red-300"> - </span>}
            <span className="capitalize font-normal italic text-red-300">
              {timeEstimateError ? `${timeEstimateError}` : ""}
            </span>
          </label>
          <input
            type="number"
            id="ticket-time-estimate"
            name="time-estimate"
            placeholder="How long will it take?"
            className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2"
            value={timeEstimate as number}
            onChange={(event) => {
              // only allow numbers and floats to be entered in the input
              const value = event.target.value;
              if (value === "") {
                setTimeEstimate("");
              }
              if (value.match(/^\d*\.?\d*$/)) {
                setTimeEstimate(value);
              }
            }}
          />
        </div>

        <button
          className="font-open font-semibold px-4 py-2 text-ss mt-4 bg-blue-600 text-white rounded hover:bg-blue-700 hover:text-blue-100 disabled:opacity-80 disabled:cursor-not-allowed  transition flex justify-center"
          disabled={processing}
          type="submit"
        >
          {processing ? <ThreeDotsLoader /> : "Create"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
