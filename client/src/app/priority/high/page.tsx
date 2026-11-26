import React from "react";
import { Priority } from "@/state/api";
import PriorityTasksPage from "@/features/priority/priority-tasks-page";

const High = () => {
  return <PriorityTasksPage priority={Priority.High} />;
};

export default High;
