import {
  Status,
  useGetTasksByProjectIdQuery,
  useUpdateTaskStatusByIdMutation,
} from "@/state/api";
import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import TaskColumn from "./task-column";

type Props = {
  id: string;
  onAddNewTaskByStatus: (status: Status) => void;
};

const BoardView = ({ id, onAddNewTaskByStatus }: Props) => {
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
        {Object.values(Status).map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            onAddNewTask={() => onAddNewTaskByStatus(status)}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default BoardView;
