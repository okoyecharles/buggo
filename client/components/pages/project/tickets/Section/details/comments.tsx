import React from "react";
import { Comment } from "../../../../../../types/models";
import Image from "next/image";
import getDate from "../../../../../../utils/dateHelper";
import { useSelector } from "react-redux";
import { storeType } from "../../../../../../redux/configureStore";

interface TicketCommentsProps {
  comments: Comment[];
}

const isNextCommentFromSameAuthor = (
  currentComment: Comment,
  prevComment: Comment
) => {
  // Check if author of current comment is same as author of previous comment and if the time difference between the two comments is less than 5 minutes
  return (
    currentComment.author._id === prevComment?.author._id &&
    prevComment &&
    new Date(currentComment.createdAt).getTime() -
      new Date(prevComment.createdAt).getTime() <
      3 * 60 * 1000
  );
};

const TicketComments: React.FC<TicketCommentsProps> = ({ comments }) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);

  const isCommentAuthour = (comment: Comment) => {
    return currentUser.user?._id === comment.author._id;
  };

  return (
    <>
      <p className="p-3 text-sm text-gray-400 text-center bg-gray-825">
        {comments.length
          ? "This is the beginning of this comments."
          : "No comments yet. Be the first to comment."}
      </p>
      <ul className="ticket-comments-section-container text-sm flex-1 flex flex-col bg-gray-825 pb-12">
        {comments.map((comment, index) => (
          <li
            className={`hover:bg-gray-850 px-3 py-1 flex flex-col gap-2 ${
              isNextCommentFromSameAuthor(comment, comments[index - 1]) &&
              index !== 0
                ? ""
                : "mt-2"
            }`}
          >
            {isNextCommentFromSameAuthor(
              comment,
              comments[index - 1]
            ) ? null : (
              <header
                className={`flex gap-2 items-center select-none ${
                  isCommentAuthour(comment) ? "justify-end" : ""
                }`}
              >
                <div className="mr-1">
                  <Image
                    src={comment.author.image}
                    alt="comment-author"
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full"
                  />
                </div>
                <h3
                  className={`font-semibold max-w-[10ch] truncate ${
                    isCommentAuthour(comment) ? "text-orange-400" : "text-white"
                  }`}
                >
                  {comment.author.name.split(" ")[0]}
                </h3>
                <span className="text-xsm text-gray-400 font-semibold">
                  {getDate(comment.createdAt)}
                </span>
              </header>
            )}
            <p
              className={`ml-2 font-semibold text-gray-200 font-open ${
                isCommentAuthour(comment) ? "text-right" : ""
              }`}
            >
              {comment.text}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TicketComments;
