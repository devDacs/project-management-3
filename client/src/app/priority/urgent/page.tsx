import React from "react";
import { Priority } from "@/state/api";
import PriorityTasksPage from "@/features/priority/priority-tasks-page";

const Urgent = () => {
  return <PriorityTasksPage priority={Priority.Urgent} />;
};

export default Urgent;
