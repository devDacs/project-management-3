import PriorityTasksPage from "@/features/priority/priority-tasks-page";
import { Priority } from "@/state/api";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: { priority: string };
};

const priorities = {
  urgent: Priority.Urgent,
  high: Priority.High,
  medium: Priority.Medium,
  low: Priority.Low,
  backlog: Priority.Backlog,
};

type PrioritySlug = keyof typeof priorities;

const isPrioritySlug = (slug: string): slug is PrioritySlug => {
  return Object.prototype.hasOwnProperty.call(priorities, slug);
};

const PriorityPage = ({ params: { priority } }: Props) => {
  if (!isPrioritySlug(priority)) {
    notFound();
  }

  return <PriorityTasksPage priority={priorities[priority]} />;
};

export default PriorityPage;
