import React from "react";
import { Priority } from "@/state/api";
import PriorityTasksPage from "@/features/priority/priority-tasks-page";

const Medium = () => {
  return <PriorityTasksPage priority={Priority.Medium} />;
};

export default Medium;
