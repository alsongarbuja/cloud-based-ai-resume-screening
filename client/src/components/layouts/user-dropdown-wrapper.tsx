"use client";

import { UserType } from "@/types";
import UserDropdown from "./user-dropdown";

interface UserDropdownWrapperProps {
  email: string;
  name: string;
  image: string;
  type: UserType;
}

const UserDropdownWrapper = ({ email, name, image, type }: UserDropdownWrapperProps) => {
  // if (status === "loading") {
  //   return <div className="size-[42px] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  // }

  // const userType = user?.userType;

  return <UserDropdown email={email} name={name} image={image} userType={type} />;
};

export default UserDropdownWrapper;
