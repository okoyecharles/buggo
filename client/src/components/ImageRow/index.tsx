import React from "react";
import { User } from "../../types/models";
import Image from "next/image";

interface ImageRowProps {
  model: {
    team: User[];
  };
  maxImages: number;
  continueText?: string;
  emptyText?: string;
}

const ImageRow: React.FC<ImageRowProps> = ({
  model,
  maxImages,
  continueText,
  emptyText,
}) => {
  return (
    <div className="flex gap-2 items-center h-7">
      {model.team.length ? (
        <>
          {model.team.slice(0, maxImages).map((member) => (
            <div className="h-full aspect-square ring-orange-500/50 ring-1 rounded-full bg-gray-800 flex overflow-hidden">
              <Image
                key={member._id}
                src={member.image}
                alt={member.name}
                width={25}
                height={25}
                className="bg-gray-800 w-full object-center object-cover"
              />
            </div>
          ))}
          {model.team.length > maxImages ? (
            <p className="text-sm font-noto font-bold text-orange-400 whitespace-nowrap">
              + {model.team.length - maxImages} {continueText || "more"}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-ss text-gray-500">
          {emptyText || "No team members"}
        </p>
      )}
    </div>
  );
};

export default ImageRow;
