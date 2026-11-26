"use client";

import {
  Priority,
  Project,
  Task,
  useGetAuthUserQuery,
  useGetProjectsQuery,
  useGetTasksByUserIdQuery,
} from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { useAppSelector } from "@/store/store";
import Header from "@/components/header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/data-grid-styles";
import { format } from "date-fns";

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

const taskColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
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
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: currentUser } = useGetAuthUserQuery({});

  const userId = currentUser?.userDetails?.id;

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksByUserIdQuery({ id: userId! }, { skip: !userId });

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useGetProjectsQuery();

  if (tasksLoading || projectsLoading) return <div>Loading...</div>;
  if (tasksError || !tasks || projectsError || !projects)
    return <div>Error fetching data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, { priority }: Task) => {
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, { endDate }: Project) => {
      const status = endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  const chartColors = isDarkMode
    ? {
        bar: "#8884D8",
        barGrid: "#303030",
        pieFill: "#4A90E2",
        text: "#FFFFFF",
      }
    : {
        bar: "#8884D8",
        barGrid: "#E0E0E0",
        pieFill: "#82CA9D",
        text: "#000000",
      };

  return (
    <div className="container h-full w-full bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82CA9D" label>
                {projectStatus.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index & COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>

          <div className="h-[300px] w-full">
            <DataGrid
              rows={tasks || []}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
