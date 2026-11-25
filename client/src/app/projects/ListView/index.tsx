import Button from "@/components/Button";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksByProjectIdQuery } from "@/state/api";
import React from "react";

type Props = {
  id: string;
  onAddNewTask: () => void;
};

const ListView = ({ id, onAddNewTask }: Props) => {
  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksByProjectIdQuery({ id: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occured while fetching tasks</div>;

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          isSmallText
          buttonComponent={
            <Button label="Add New Task" onClick={onAddNewTask} />
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
