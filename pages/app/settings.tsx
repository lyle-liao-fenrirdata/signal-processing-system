import React from "react";

import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";

import AdminLayout from "components/layouts/Admin";

export default function Settings() {
  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "設定", href: "/app/settings" }],
      }}
    >
      <div className="flex flex-wrap">
        <div className="w-full px-4 lg:w-8/12">
          <CardSettings />
        </div>
        <div className="w-full px-4 lg:w-4/12">
          <CardProfile />
        </div>
      </div>
    </AdminLayout>
  );
}
