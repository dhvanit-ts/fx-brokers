import UserProfile from "@/components/helping/UserProfile";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserProfile />
      {children}
    </>
  );
}

export default Layout;
