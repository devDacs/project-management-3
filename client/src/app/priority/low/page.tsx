import React from "react";
import { Priority } from "@/state/api";
import PriorityTasksPage from "@/features/priority/priority-tasks-page";

const Low = () => {
  return <PriorityTasksPage priority={Priority.Low} />;
};

export default Low;
