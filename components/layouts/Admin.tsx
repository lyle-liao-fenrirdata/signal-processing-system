import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import FooterAdmin from "components/Footers/FooterAdmin";

export default function Admin({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="relative bg-slate-100 md:ml-40">
        <AdminNavbar />
        <div className="mx-auto min-h-screen w-full px-4 pt-8 md:px-10 md:pt-28">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
