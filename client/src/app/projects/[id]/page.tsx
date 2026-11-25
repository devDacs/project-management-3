"use client";

import React, { useState } from "react";
import ProjectHeader from "../ProjectHeader";
import { useAppSelector } from "@/app/redux";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";
import { Status } from "@/state/api";

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
      <ModalNewTask
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
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}

      {activeTab === "List" && (
        <List id={id} onAddNewTask={() => setIsModalNewTaskOpen(true)} />
      )}

      {activeTab === "Timeline" && (
        <Timeline id={id} onAddNewTask={() => setIsModalNewTaskOpen(true)} />
      )}

      {activeTab === "Table" && (
        <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
