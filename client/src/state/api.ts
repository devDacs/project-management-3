import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

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

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  users: User[];
}

export interface Team {
  id: number;
  teamName: string;
  productOwernerUserId: number | null;
  projectManagerUserId: number | null;

  teamProductOwner: User | null;
  teamProjectManager: User | null;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams"],
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
    updateTaskStatusById: mutation<Task, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `tasks/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Tasks" as const, id }],
    }),
    search: query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
      transformResponse: ({ data }) => data,
    }),
    getUsers: query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
      transformResponse: ({ data }) => data,
    }),
    getTeams: query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
      transformResponse: ({ data }) => data,
    }),
    getTasksByUserId: query<Task[], { id: number }>({
      query: ({ id }) => `tasks/user/${id}`,
      transformResponse: ({ data }) => data,
      providesTags: (result, _, { id: userId }) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const, id: userId }],
    }),
    getAuthUser: query({
      queryFn: async (_, __, ___, baseQuery) => {
        try {
          const user = await getCurrentUser();
          const session = await fetchAuthSession();

          if (!session) {
            throw new Error("No session found");
          }

          const { userSub } = session;

          const userDetailsResponse = await baseQuery(
            `users/cognitoId/${userSub}`,
          );

          if (userDetailsResponse.error) {
            return { error: userDetailsResponse.error };
          }

          const userDetails = (userDetailsResponse.data as { data: User }).data;

          return { data: { user, userSub, userDetails } };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksByProjectIdQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusByIdMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserIdQuery,
  useGetAuthUserQuery,
} = api;
