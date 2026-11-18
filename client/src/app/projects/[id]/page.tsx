"use client";

import React, { useState } from "react";
import ProjectHeader from "../ProjectHeader";

type Props = {
  params: { id: string };
};

const Project = ({ params: { id } }: Props) => {
  const [activeTab, setActiveTab] = useState("Board");

  return (
    <div>
      {/* MODAL NEW TASK */}

      <ProjectHeader activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Project;
