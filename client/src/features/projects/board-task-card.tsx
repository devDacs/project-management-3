import { TaskWithOptionalRelations } from "@/state/api";
import { format } from "date-fns";
import { EllipsisVertical, MessageSquareMore } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDrag } from "react-dnd";

type Props = {
  task: TaskWithOptionalRelations;
};

const TASK_PRIORITY = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  BACKLOG: "Backlog",
} as const;

type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TASK_PRIORITY.URGENT]: "bg-red-200 text-red-700",
  [TASK_PRIORITY.HIGH]: "bg-yellow-200 text-yellow-700",
  [TASK_PRIORITY.MEDIUM]: "bg-green-200 text-green-700",
  [TASK_PRIORITY.LOW]: "bg-blue-200 text-blue-700",
  [TASK_PRIORITY.BACKLOG]: "bg-gray-200 text-gray-700",
};

const BoardTaskCard = ({
  task: {
    id,
    tags,
    comments,
    startDate,
    dueDate,
    attachments,
    priority,
    title,
    points,
    description,
    assignee,
    author,
  },
}: Props): React.ReactNode => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id },
    collect: (monitor: any) => ({ isDragging: monitor.isDragging() }),
  }));

  const taskTagsSplit = tags ? tags.split(",") : [];

  const formattedStartDate = startDate
    ? format(new Date(startDate), "P")
    : "No provided start date";
  const formattedDueDate = dueDate
    ? format(new Date(dueDate), "P")
    : "No provided due date";

  const numberOfComments = comments?.length ?? 0;

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* ATTACHMENT PHOTO */}
      {attachments && attachments.length > 0 && (
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${attachments[0].fileURL}`}
          alt={attachments[0].fileName ?? "Attachment"}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )}

      <div className="p-4 md:p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          {/* CHIPS */}
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* PRIORITY */}
            {priority && (
              <div
                className={`rounded-full px-2 py-1 text-xs font-semibold ${TASK_PRIORITY_COLORS[priority as TaskPriority]}`}
              >
                {priority}
              </div>
            )}

            {/* TAGS */}
            <div className="flex gap-2">
              {taskTagsSplit.map((tag) => (
                <div
                  key={tag}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div>

        {/* BODY */}
        <div className="my-3 flex justify-between">
          {/* TITLE */}
          <h4 className="text-md font-bold dark:text-white">{title}</h4>

          {/* POINTS */}
          {typeof points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {points} pts
            </div>
          )}
        </div>

        {/* DATES */}
        <div className="text-xs text-gray-500 dark:text-neutral-500">
          <span>{formattedStartDate} - </span>
          <span>{formattedDueDate}</span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {description}
        </p>

        {/* HORIZONTAL LINE */}
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* FOOTER */}
        <div className="mt-3 flex items-center justify-between">
          {/* USERS */}
          <div className="flex -space-x-[6px] overflow-hidden">
            {/* ASSIGNEE */}
            {assignee && (
              <Image
                key={assignee.id}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${assignee.profilePictureUrl}`}
                alt={assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}

            {/* AUTHOR */}
            {author && (
              <Image
                key={author.id}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${author.profilePictureUrl}`}
                alt={author.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>

          {/* COMMENTS */}
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            {/* ICON */}
            <MessageSquareMore size={20} />

            {/* NUMBER OF COMMENTS */}
            <span className="ml-1 text-sm dark:text-neutral-400">
              {numberOfComments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardTaskCard;
