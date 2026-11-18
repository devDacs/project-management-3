"use client";

import React from "react";
import ProjectHeader from "../ProjectHeader";
import { useAppSelector } from "@/app/redux";

type Props = {
  params: { id: string };
};

const Project = ({ params: { id } }: Props) => {
  const activeTab = useAppSelector(
    (state) => state.global.lastActiveProjectTab,
  );

  return (
    <div>
      {/* MODAL NEW TASK */}

      <ProjectHeader activeTab={activeTab} />
    </div>
  );
};

export default Project;
