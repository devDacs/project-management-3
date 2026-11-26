"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/store/store";
import CreateTaskModal from "@/features/tasks/create-task-modal";
import { Status } from "@/state/api";
import Board from "@/features/projects/board-view";
import List from "@/features/projects/list-view";
import Table from "@/features/projects/table-view";
import Timeline from "@/features/projects/timeline-view";
import ProjectHeader from "@/features/projects/project-header";

type Props = {
  params: { id: string };
};

const Project = ({ params: { id } }: Props) => {
  const activeTab = useAppSelector(
    (state) => state.global.lastActiveProjectTab,
  );
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [toStatus, setToStatus] = useState<Status | null>(null);

  return (
    <div>
      {/* MODAL NEW TASK */}
      <CreateTaskModal
        id={id}
        isOpen={isModalNewTaskOpen}
        toStatus={toStatus}
        onClose={() => {
          setIsModalNewTaskOpen(false);
          setToStatus(null);
        }}
      />

      <ProjectHeader activeTab={activeTab} />

      {activeTab === "Board" && (
        <Board
          id={id}
          onAddNewTaskByStatus={(status) => {
            setToStatus(status);
            setIsModalNewTaskOpen(true);
          }}
        />
      )}

      {activeTab === "List" && (
        <List id={id} onAddNewTask={() => setIsModalNewTaskOpen(true)} />
      )}

      {activeTab === "Timeline" && (
        <Timeline id={id} onAddNewTask={() => setIsModalNewTaskOpen(true)} />
      )}

      {activeTab === "Table" && (
        <Table id={id} onAddNewTask={() => setIsModalNewTaskOpen(true)} />
      )}
    </div>
  );
};

export default Project;
