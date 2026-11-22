import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user: { username, profilePictureUrl } }: Props) => {
  return (
    <div className="mb-3 flex items-center gap-4 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
      {profilePictureUrl && (
        <Image
          src={`/${profilePictureUrl}`}
          alt={username}
          width={32}
          height={32}
          className="h-9 w-9 rounded-full object-cover"
        />
      )}
      <div>
        <h3>{username}</h3>
      </div>
    </div>
  );
};

export default UserCard;
