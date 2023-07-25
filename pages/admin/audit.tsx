import React from "react";

import CardTable from "components/Cards/CardTable.js";

import AdminLayout from "components/layouts/Admin";

export default function Audit() {
  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "稽核勾稽", href: "/admin/audit" }],
        user: { name: "anonymous" },
      }}
    >
      <div className="mt-4 flex flex-wrap">
        <div className="mb-12 w-full px-4">
          <CardTable />
        </div>
        <div className="mb-12 w-full px-4">
          <CardTable color="dark" />
        </div>
      </div>
    </AdminLayout>
  );
}
