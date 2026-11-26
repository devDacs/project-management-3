"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import Button from "@/components/button";
import Header from "@/components/header";
import CreateTaskModal from "@/features/tasks/create-task-modal";
import TaskCard from "@/components/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { setLastActivePriorityView } from "@/state";
import {
  Priority,
  Task,
  useGetAuthUserQuery,
  useGetTasksByUserIdQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  priority: Priority;
};

const TASK_STATUS = {
  TO_DO: "To Do",
  WORK_IN_PROGRESS: "Work In Progress",
  UNDER_REVIEW: "Under Review",
  COMPLETED: "Completed",
} as const;

type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TASK_STATUS.TO_DO]: "bg-blue-200 text-blue-700",
  [TASK_STATUS.WORK_IN_PROGRESS]: "bg-green-200 text-green-700",
  [TASK_STATUS.UNDER_REVIEW]: "bg-orange-200 text-orange-700",
  [TASK_STATUS.COMPLETED]: "bg-gray-200 text-gray-700",
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: ({ value }) => (
      <span
        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${TASK_STATUS_COLORS[value as TaskStatus]}`}
      >
        {value}
      </span>
    ),
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
    renderCell: ({ value }) =>
      value ? format(new Date(value), "P") : "Not Set",
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
    renderCell: ({ value }) =>
      value ? format(new Date(value), "P") : "Not Set",
  },
  {
    field: "author",
    headerName: "Author",
    width: 100,
    renderCell: ({ value }) => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-9 w-9">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${value.profilePictureUrl}`}
            alt={value.username}
            width={100}
            height={50}
            className="h-full rounded-full object-cover"
          />
        </div>
      </div>
    ),
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 100,
    renderCell: ({ value }) =>
      !value ? (
        "Unassigned"
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-9 w-9">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${value.profilePictureUrl}`}
              alt={value.username}
              width={100}
              height={50}
              className="h-full rounded-full object-cover"
            />
          </div>
        </div>
      ),
  },
];

const PriorityTasksPage = ({ priority }: Props) => {
  const dispatch = useAppDispatch();

  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  const { data: currentUser } = useGetAuthUserQuery({});

  const userId = currentUser?.userDetails?.id;

  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksByUserIdQuery({ id: userId! }, { skip: !userId });

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const lastActivePriorityView = useAppSelector(
    (state) => state.global.lastActivePriorityView,
  );

  const filteredTasks = tasks?.filter(
    ({ priority: taskPriority }: Task) => taskPriority === priority,
  );

  if (isError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className="m-5 p-4">
      {/* MODAL NEW TASK */}
      <CreateTaskModal
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />

      {/* HEADER */}
      <Header
        name="Priority Page"
        buttonComponent={
          <Button
            label="Add New Task"
            onClick={() => setIsModalNewTaskOpen(true)}
          />
        }
      />

      <div className="mb-4 flex justify-start">
        <button
          className={`rounded-l px-4 py-2 ${lastActivePriorityView === "list" ? "bg-gray-300" : "bg-white"}`}
          onClick={() => dispatch(setLastActivePriorityView("list"))}
        >
          List
        </button>
        <button
          className={`rounded-r px-4 py-2 ${lastActivePriorityView === "table" ? "bg-gray-300" : "bg-white"}`}
          onClick={() => dispatch(setLastActivePriorityView("table"))}
        >
          Table
        </button>
      </div>

      {isLoading ? (
        <div>Loading tasks...</div>
      ) : lastActivePriorityView === "list" ? (
        filteredTasks && (
          <div className="grid grid-cols-1 gap-4">
            {filteredTasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )
      ) : (
        filteredTasks && (
          <div className="w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default PriorityTasksPage;
