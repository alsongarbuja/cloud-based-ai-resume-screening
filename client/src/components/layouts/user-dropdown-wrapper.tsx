"use client";

import UserDropdown from "./user-dropdown";

interface UserDropdownWrapperProps {
  email: string;
  name: string;
  image: string;
}

const UserDropdownWrapper = ({ email, name, image }: UserDropdownWrapperProps) => {
  // if (status === "loading") {
  //   return <div className="size-[42px] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  // }

  // const userType = user?.userType;

  return <UserDropdown email={email} name={name} image={image} userType={"USER"} />;
};

export default UserDropdownWrapper;
