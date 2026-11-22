import { Project } from "@/state/api";
import { format } from "date-fns";
import React from "react";

type Props = {
  project: Project;
};

const ProjectCard = ({
  project: { name, description, startDate, endDate },
}: Props) => {
  const formattedStartDate = startDate
    ? format(new Date(startDate), "P")
    : "Not set";

  const formattedEndDate = endDate ? format(new Date(endDate), "P") : "Not set";

  return (
    <div className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
      <h3>{name}</h3>
      <p>{description}</p>
      <p>Start Date: {formattedStartDate}</p>
      <p>End Date: {formattedEndDate}</p>
    </div>
  );
};

export default ProjectCard;
