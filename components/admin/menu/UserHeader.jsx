import React from "react";

function UserHeader({ user, profilePhotoUrl }) {
  return (
    <div className="flex justify-end items-center gap-4 pb-4 border-b border-gray-800 w-full">
      <div className="flex flex-col items-end">
        <p className="font-semibold text-white">{user?.username || "کاربر"}</p>
        <p className="text-sm text-gray-400">{user?.phone_number || ""}</p>
      </div>
      <div className="relative rounded-full overflow-hidden">
        <img
          className="w-14 h-14 object-cover"
          src={profilePhotoUrl || "/user.png"}
          alt="user avatar"
        />
      </div>
    </div>
  );
}

export default UserHeader;