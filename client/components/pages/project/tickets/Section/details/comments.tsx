import React from "react";
import { Comment } from "../../../../../../types/models";
import Image from "next/image";
import defaultAvatar from "../../../../../../db/avatar/default";
import getDate from "../../../../../../utils/dateHelper";

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
  return (
    <div className="ticket-comments-section bg-gray-825 rounded-sm flex flex-col h-full max-h-[10rem] overflow-y-scroll ">
      <span className="p-3 text-sm text-gray-400 text-center">
        This is the beginning of this comments.
      </span>
      <ul className="ticket-comments-section-container text-sm flex flex-col">
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
              <header className="flex gap-2 items-center select-none">
                <div className="mr-1">
                  <Image
                    src={defaultAvatar}
                    alt="comment-author"
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full"
                  />
                </div>
                <h3 className="font-semibold text-white max-w-[10ch] truncate">
                  {comment.author.name.split(" ")[0]}
                </h3>
                <span className="text-xsm text-gray-400 font-semibold">
                  {getDate(comment.createdAt)}
                </span>
              </header>
            )}
            <p>{comment.text}</p>
          </li>
        ))} 
      </ul>
    </div>
  );
};

export default TicketComments;
