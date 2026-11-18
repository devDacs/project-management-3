import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: number;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  tags: string | null;
  startDate: string | null;
  dueDate: string | null;
  points: number | null;
  projectId: number;
  authorUserId: number;
  assignedUserId: number | null;

  author: User | null;
  assignee: User | null;
  comments: Comment[];
  attachments: Attachment[];
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "UnderReview",
  Completed = "Completed",
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export interface User {
  id: number;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  cognitoId: string;
  teamId: string | null;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string | null;
  taskId: number;
  uploadedById: number;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks"],
  endpoints: ({ query, mutation }) => ({
    getProjects: query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
      transformResponse: ({ data }) => data,
    }),
    createProject: mutation<Project, Partial<Project>>({
      query: (body) => ({
        url: "projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasksByProjectId: query<Task[], { id: number }>({
      query: ({ id }) => `tasks/project/${id}`,
      transformResponse: ({ data }) => data,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : ["Tasks"],
    }),
    createTask: mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksByProjectIdQuery,
  useCreateTaskMutation,
} = api;
