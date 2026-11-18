import Header from "@/components/Header";
import React from "react";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="px-4 xl:px-6">
      {/* MODAL NEW PROJECT */}

      <div className="py-6 lg:pb-4 lg:pt-8">
        <Header name="Product Design Development" />
      </div>
    </div>
  );
};

export default ProjectHeader;
