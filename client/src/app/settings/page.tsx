import Header from "@/components/header";
import React from "react";

const USER_SETTINGS = {
  username: "johndoe",
  email: "john.doe@example.com",
  teamName: "Development Team",
  roleName: "Developer",
};

const LABEL_STYLES = "block text-sm font-medium dark:text-white";

const TEXT_STYLES =
  "mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm dark:text-white";

const Settings = () => {
  const { username, email, teamName, roleName } = USER_SETTINGS;

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className={LABEL_STYLES}>Username</label>
          <div className={TEXT_STYLES}>{username}</div>
        </div>
        <div>
          <label className={LABEL_STYLES}>Email</label>
          <div className={TEXT_STYLES}>{email}</div>
        </div>
        <div>
          <label className={LABEL_STYLES}>Team</label>
          <div className={TEXT_STYLES}>{teamName}</div>
        </div>
        <div>
          <label className={LABEL_STYLES}>Role</label>
          <div className={TEXT_STYLES}>{roleName}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
