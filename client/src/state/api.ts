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
}

export interface TaskWithOptionalRelations extends Task {
  author?: User | null;
  assignee?: User | null;
  comments?: TaskComment[];
  attachments?: Attachment[];
}

export interface ProjectTask extends TaskWithOptionalRelations {
  author: User;
  assignee: User | null;
  comments: TaskComment[];
  attachments: Attachment[];
}

export interface UserTask extends TaskWithOptionalRelations {
  author: User;
  assignee: User | null;
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
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
  profilePictureUrl: string | null;
  cognitoId: string;
  teamId: number | null;
}

export interface SearchUser {
  id: number;
  username: string;
  profilePictureUrl: string | null;
}

export interface Attachment {
  id: number;
  fileURL: string;
  fileName: string | null;
  taskId: number;
  uploadedById: number;
}

export interface TaskComment {
  id: number;
  text: string;
  taskId: number;
  userId: number;
}

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  users: SearchUser[];
}

export interface TeamMemberSummary {
  username: string;
  profilePictureUrl: string | null;
}

export interface Team {
  id: number;
  teamName: string;
  productOwnerUserId: number | null;
  projectManagerUserId: number | null;

  teamProductOwner: TeamMemberSummary | null;
  teamProjectManager: TeamMemberSummary | null;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { accessToken } = session.tokens ?? {};

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      return headers;
    },
  }),
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
    getTasksByProjectId: query<ProjectTask[], { id: number }>({
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
    getTasksByUserId: query<UserTask[], { id: number }>({
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
