import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import moment from "moment";
import store, { storeType } from "../../../../../../redux/configureStore";
import {
  fetchTicketById,
  updateTicket,
} from "../../../../../../redux/actions/ticketActions";
import { useSelector } from "react-redux";
import { TailSpinLoader, ThreeDotsLoader } from "../../../../../loader";
import { restrictLength } from "../../../../../../utils/stringHelper";
import Pluralize from "react-pluralize";
import TicketComments from "./comments";
import { Ticket } from "../../../../../../types/models";
import getDate from "../../../../../../utils/dateHelper";

interface TicketDetailsBarProps {
  ticket: Ticket | null;
  open: boolean;
  setOpen: any;
}

const TicketDetailsBar: React.FC<TicketDetailsBarProps> = ({
  open,
  setOpen,
  ticket,
}) => {
  const ticketDetails = useSelector((store: storeType) => store.ticket);
  const [showAllDescription, setShowAllDescription] = useState(false);

  useEffect(() => {
    if (ticket) {
      store.dispatch(fetchTicketById(ticket._id));
    }
  }, [ticket]);
  return (
    <aside
      className={`bg-gray-850 fixed lg:absolute top-16 lg:top-0 w-screen lg:w-72 right-0 bottom-[66px] lg:h-full lg:border-l border-gray-700 ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-all`}
    >
      <div className="relative flex flex-col h-full">
        <header className="flex p-3 gap-2 border-b border-gray-700">
          <div className="flex-1 flex flex-col gap-1">
            <h2 className="font-semibold text-gray-100 text-lg">
              {ticket?.title}
            </h2>
            <span
              className={`uppercase text-xsm py-1 px-2 font-bold ring-1 rounded-sm h-fit w-fit ${
                ticket?.status === "open"
                  ? "ring-blue-500 text-blue-500"
                  : "ring-red-500 text-red-500"
              }`}
            >
              {ticket?.status}
            </span>
            <p className="text-sm text-gray-500 font-semibold">
              <span>{`Created ${getDate(ticket?.createdAt, {
                format: "on calendar",
              })}`}</span>
            </p>
          </div>
          <div>
            <button
              name="close modal"
              className="text-3xl lg:text-xl text-white lg:text-gray-500 lg:hover:text-gray-200 transition h-6 w-6 flex items-center justify-center"
              onClick={() => {
                setOpen(false);
              }}
            >
              <IoMdClose />
            </button>
          </div>
        </header>

        {ticketDetails.loading && ticketDetails.method.details ? (
          <div className="p-3 aspect-square grid place-items-center">
            <div className="flex flex-col items-center gap-2">
              {" "}
              <TailSpinLoader color="orange" width={50} height={50} />
              <p className="text-ss">Loading details...</p>{" "}
            </div>
          </div>
        ) : (
          <div className="text-ss text-gray-100 gap-2 flex-1 flex flex-col">
            <div className="ticket-content p-3 border-b border-gray-700">
              {/* Time estimate */}
              <h3 className="font-semibold text-sm text-gray-300 mb-4">
                <span className="uppercase text-orange-400">
                  Time estimated
                </span>
                :{" "}
                <Pluralize
                  singular="hour"
                  count={ticketDetails.ticket?.time_estimate}
                />
              </h3>

              {/* Description */}
              <h3 className="font-semibold text-sm text-gray-400">
                Description
              </h3>
              <p>
                {showAllDescription
                  ? ticketDetails.ticket?.description
                  : restrictLength(ticketDetails.ticket?.description, 200)}
                {(ticketDetails.ticket?.description?.length || 0) > 200 && (
                  <button
                    className="text-orange-400 ml-1"
                    onClick={() => {
                      setShowAllDescription(!showAllDescription);
                    }}
                  >
                    {showAllDescription ? "less" : "more"}
                  </button>
                )}
              </p>
            </div>

            <div className="ticket-comments pt-3 flex flex-col gap-2 flex-1 mb-[62px]">
              <header className="mx-3">
                <h3 className="font-semibold">Comments</h3>
              </header>
              <div className="flex-1 relative">
                <TicketComments
                  comments={[
                    {
                      _id: "1",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "1",
                        name: "John Doe",
                        email: "johndoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "2",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "3",
                      text: "This is the comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "4",
                      text: "This is another comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "3",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "63bf16cf57fbdc0fde8b193e",
                        name: "Okoye Charles",
                        email: "okoyecharles509@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "4",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:02:00.000Z",
                      author: {
                        _id: "63bf16cf57fbdc0fde8b193e",
                        name: "Okoye Charles",
                        email: "okoyecharles509@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "1",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "1",
                        name: "John Doe",
                        email: "johndoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "2",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "3",
                      text: "This is the comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "4",
                      text: "This is another comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "3",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "63bf16cf57fbdc0fde8b193e",
                        name: "Okoye Charles",
                        email: "okoyecharles509@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "4",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:02:00.000Z",
                      author: {
                        _id: "63bf16cf57fbdc0fde8b193e",
                        name: "Okoye Charles",
                        email: "okoyecharles509@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "1",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "1",
                        name: "John Doe",
                        email: "johndoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "2",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "3",
                      text: "This is the comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "4",
                      text: "This is another comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "2",
                        name: "Alice Doe",
                        email: "alicedoe@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "3",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:00:00.000Z",
                      author: {
                        _id: "63bf16cf57fbdc0fde8b193e",
                        name: "Okoye Charles",
                        email: "okoyecharles509@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                    {
                      _id: "4",
                      text: "This is a comment",
                      createdAt: "2021-09-01T12:02:00.000Z",
                      author: {
                        _id: "63bf16cf57fbdc0fde8b193e",
                        name: "Okoye Charles",
                        email: "okoyecharles509@gmail.com",
                        admin: true,
                        image: "https://picsum.photos/200",
                      },
                    },
                  ]}
                />
                <input className="absolute bottom-2 w-[calc(100%-1.5rem)] left-3 rounded bg-gray-700 outline-none px-2 py-1 shadow-sm text-sm text-white font-semibold" type="text" placeholder="Comment here" />
              </div>
            </div>
          </div>
        )}

        <div className="buttons p-3 absolute bottom-0 left-0 w-full border-t border-gray-700 flex flex-col gap-2">
          <button
            className="bg-blue-500 flex justify-center p-2 text-ss font-semibold rounded text-blue-50 hover:bg-blue-600 disabled:opacity-75 disabled:cursor-not-allowed transition-colors"
            disabled={
              ticketDetails.loading ||
              ticketDetails.method.update ||
              ticketDetails.ticket?.status === "closed"
            }
            onClick={() => {
              store.dispatch(
                updateTicket(ticketDetails.ticket?._id!, {
                  status: "open",
                })
              );
            }}
          >
            {ticketDetails.loading && ticketDetails.method.update ? (
              <ThreeDotsLoader />
            ) : (
              "Close Ticket"
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TicketDetailsBar;