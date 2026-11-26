import { Status, Task } from "@/state/api";
import React from "react";
import { EllipsisVertical, Plus } from "lucide-react";
import { useDrop } from "react-dnd";
import BoardTaskCard from "./board-task-card";

type Props = {
  status: string;
  tasks: Task[];
  moveTask: (id: number, toStatus: string) => void;
  onAddNewTask: () => void;
};

type TaskStatus = (typeof Status)[keyof typeof Status];

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [Status.ToDo]: "#2563EB",
  [Status.WorkInProgress]: "#059669",
  [Status.UnderReview]: "#D97706",
  [Status.Completed]: "#000000",
};

const TaskColumn = ({ status, tasks, moveTask, onAddNewTask }: Props) => {
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
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
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
              onClick={onAddNewTask}
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
          <BoardTaskCard key={task.id} task={task} />
        ))}
    </div>
  );
};

export default TaskColumn;
