import AdminProfile from "@/components/helping/AdminProfile";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminProfile />
      {children}
    </>
  );
}

export default Layout;
