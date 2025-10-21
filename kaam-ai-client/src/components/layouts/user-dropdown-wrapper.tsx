"use client";

import UserDropdown from "./user-dropdown";
import { useSession } from "next-auth/react";

interface UserDropdownWrapperProps {
  email: string;
  name: string;
  image: string;
}

const UserDropdownWrapper = ({ email, name, image }: UserDropdownWrapperProps) => {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="size-[42px] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }
  
  const userType = session?.user?.userType;
  
  return (
    <UserDropdown
      email={email}
      name={name}
      image={image}
      userType={userType || ""}
    />
  );
};

export default UserDropdownWrapper;