import { useAppSelector } from "@/app/redux";
import Button from "@/components/button";
import Header from "@/components/header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetTasksByProjectIdQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";

type Props = {
  id: string;
  onAddNewTask: () => void;
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
    field: "priority",
    headerName: "Priority",
    width: 130,
    renderCell: ({ value }) => (
      <span
        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${TASK_PRIORITY_COLORS[value as TaskPriority]}`}
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

const TableView = ({ id, onAddNewTask }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    isLoading,
    isError,
  } = useGetTasksByProjectIdQuery({ id: Number(id) });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>An error occured while fetching tasks</div>;

  return (
    <div className="h-[540px] w-full px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Table"
          isSmallText
          buttonComponent={
            <Button label="Add New Task" onClick={onAddNewTask} />
          }
        />
      </div>
      <DataGrid
        rows={tasks || []}
        columns={columns}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
    </div>
  );
};

export default TableView;
