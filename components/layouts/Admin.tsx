import React from "react";

import AdminNavbar, { NavbarProps } from "components/Navbars/AdminNavbar";
import Sidebar, { SidebarProps } from "components/Sidebar/Sidebar";
import FooterAdmin from "components/Footers/FooterAdmin";

export default function Admin({
  children,
  navbarProps,
  sidebarProps,
}: {
  children: React.ReactNode;
  navbarProps: NavbarProps;
  sidebarProps: SidebarProps;
}) {
  return (
    <>
      <Sidebar {...sidebarProps} />
      <div className="relative bg-slate-100 md:ml-40">
        <AdminNavbar {...navbarProps} />
        <div className="mx-auto min-h-screen w-full px-4 pt-8 md:px-10 md:pt-28">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
