import {
  useGetTasksByProjectIdQuery,
  useUpdateTaskStatusByIdMutation,
} from "@/state/api";
import React from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, Plus } from "lucide-react";

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
  tasks: TaskType[];
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
    </div>
  );
};

export default BoardView;
