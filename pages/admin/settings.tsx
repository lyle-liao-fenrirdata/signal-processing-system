import React, { ReactElement } from "react";

import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";

import AdminLayout from "layouts/Admin";

export default function Settings() {
  return (
    <div className="flex flex-wrap">
      <div className="w-full px-4 lg:w-8/12">
        <CardSettings />
      </div>
      <div className="w-full px-4 lg:w-4/12">
        <CardProfile />
      </div>
    </div>
  );
}

Settings.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
