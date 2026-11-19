"use client";

import React, { useState } from "react";
import ProjectHeader from "../ProjectHeader";
import { useAppSelector } from "@/app/redux";
import Board from "../BoardView";
import List from "../ListView";

type Props = {
  params: { id: string };
};

const Project = ({ params: { id } }: Props) => {
  const activeTab = useAppSelector(
    (state) => state.global.lastActiveProjectTab,
  );
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
      {/* MODAL NEW TASK */}

      <ProjectHeader activeTab={activeTab} />

      {activeTab === "Board" && (
        <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}

      {activeTab === "List" && (
        <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
      )}
    </div>
  );
};

export default Project;
