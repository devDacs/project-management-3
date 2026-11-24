import {
  useGetTasksByProjectIdQuery,
  useUpdateTaskStatusByIdMutation,
} from "@/state/api";
import React from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
import { format } from "date-fns/format";
import Image from "next/image";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TASK_STATUS = {
  TO_DO: "To Do",
  WORK_IN_PROGRESS: "Work In Progress",
  UNDER_REVIEW: "Under Review",
  COMPLETED: "Completed",
} as const;

type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TASK_STATUS.TO_DO]: "#2563EB",
  [TASK_STATUS.WORK_IN_PROGRESS]: "#059669",
  [TASK_STATUS.UNDER_REVIEW]: "#D97706",
  [TASK_STATUS.COMPLETED]: "#000000",
};

const BoardView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksByProjectIdQuery({ id: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusByIdMutation();

  const moveTask = (id: number, toStatus: string) => {
    updateTaskStatus({ id, status: toStatus });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occured while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.values(TASK_STATUS).map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: Task[];
  moveTask: (id: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: ({ id }: { id: number }) => moveTask(id, status),
    collect: (monitor: any) => ({ isOver: monitor.isOver() }),
  }));

  const tasksCount = tasks.filter(
    ({ status: taskStatus }) => taskStatus === status,
  ).length;

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver && "bg-blue-100 dark:bg-neutral-950"}`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: TASK_STATUS_COLORS[status as TaskStatus] }}
        />

        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="font-semi-bold flex items-center text-lg dark:text-white">
            {status}

            <span className="ml-2 inline-block h-[1.5rem] w-[1.5rem] rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary">
              {tasksCount}
            </span>
          </h3>

          <div className="flex items-center gap-1">
            <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
              <EllipsisVertical size={26} />
            </button>

            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* TASKS */}
      {tasks
        .filter(({ status: taskStatus }) => taskStatus === status)
        .map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
    </div>
  );
};

const TaskCard = ({
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
}: {
  task: Task;
}): React.ReactNode => {
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
          src={`/${attachments[0].fileURL}`}
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
                src={`/${assignee.profilePictureUrl}`}
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
                src={`/${author.profilePictureUrl}`}
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

export default BoardView;
