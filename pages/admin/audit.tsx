import React, { ReactElement } from "react";

import CardTable from "components/Cards/CardTable.js";

import AdminLayout from "layouts/Admin";

export default function Audit() {
  return (
    <div className="mt-4 flex flex-wrap">
      <div className="mb-12 w-full px-4">
        <CardTable />
      </div>
      <div className="mb-12 w-full px-4">
        <CardTable color="dark" />
      </div>
    </div>
  );
}

Audit.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
