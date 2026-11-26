import React from "react";
import { Priority } from "@/state/api";
import PriorityTasksPage from "@/features/priority/priority-tasks-page";

const Backlog = () => {
  return <PriorityTasksPage priority={Priority.Backlog} />;
};

export default Backlog;
