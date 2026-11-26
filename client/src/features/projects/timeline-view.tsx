import { useAppSelector } from "@/app/redux";
import Button from "@/components/button";
import Header from "@/components/header";
import { useGetTasksByProjectIdQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import React, { useMemo, useState } from "react";
import "gantt-task-react/dist/index.css";

type Props = {
  id: string;
  onAddNewTask: () => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const TimelineView = ({ id, onAddNewTask }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksByProjectIdQuery({ id: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks?.map(({ startDate, dueDate, title, id, points }) => ({
        start: new Date(startDate as string),
        end: new Date(dueDate as string),
        name: title,
        id: `Task-${id}`,
        type: "task" as TaskTypeItems,
        progress: points ? (points / 10) * 100 : 0,
        isDisabled: false,
      })) || []
    );
  }, [tasks]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occured while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <Header
          name="Project Tasks Timeline"
          buttonComponent={
            <div className="relative inline-block w-64">
              <select
                className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
                value={displayOptions.viewMode}
                onChange={handleViewModeChange}
              >
                <option value={ViewMode.Day}>Day</option>
                <option value={ViewMode.Week}>Week</option>
                <option value={ViewMode.Month}>Month</option>
              </select>
            </div>
          }
        />
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="100px"
            barBackgroundColor={isDarkMode ? "#101214" : "#AEB8C2"}
            barBackgroundSelectedColor={isDarkMode ? "#000" : "#9BA1E6"}
          />
        </div>

        <div className="px-4 pb-5 pt-1">
          <Button label="Add New Task" onClick={onAddNewTask} />
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
