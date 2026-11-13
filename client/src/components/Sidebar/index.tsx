import React from "react";

const Sidebar = () => {
  return (
    <div className="fixed z-40 flex h-full flex-col justify-between overflow-y-auto bg-white shadow-xl transition-all duration-300 dark:bg-black">
      <div className="flex h-full w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            DACSLIST
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
