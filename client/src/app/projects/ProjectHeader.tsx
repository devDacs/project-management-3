import Header from "@/components/Header";
import { LucideIcon } from "lucide-react";
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

type TabButtonProps = {
  name: string;
  icon: LucideIcon;
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const TabButton = ({
  name,
  icon: Icon,
  activeTab,
  setActiveTab,
}: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:left-0 after:h-[1px] after:w-full hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${
        isActive && "text-blue-600 after:bg-blue-600 dark:text-white"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {<Icon className={`h-5 w-5 ${isActive && "text-blue-600"}`} />}
      <span className={`${isActive && "text-blue-600"}`}>{name}</span>
    </button>
  );
};

export default ProjectHeader;
