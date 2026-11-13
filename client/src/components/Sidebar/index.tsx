import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { LockIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";

const Sidebar = () => {
  const dispatch = useAppDispatch();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div
      className={`fixed z-40 flex h-full flex-col justify-between overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out dark:bg-black ${isSidebarCollapsed ? "-translate-x-full" : "translate-x-0"} `}
    >
      <div className="flex h-full w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            DACSLIST
          </div>

          {/* COLLAPSE / EXPAND BUTTON */}
          {!isSidebarCollapsed && (
            <button
              className="py-3"
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
              }
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>

        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.jpg" alt="Logo" width={40} height={40} />

          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              DACS TEAM
            </h3>

            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
