import React from "react";

import CardSettings from "components/Cards/CardSettings.js";
import CardProfile from "components/Cards/CardProfile.js";

import AdminLayout from "components/layouts/Admin";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps<{
  username: string;
  role: string;
}> = async ({ req }) => {
  const username = req.headers["x-username"];
  const role = req.headers["x-role"];

  if (typeof username !== "string" || typeof role !== "string") {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { username, role },
  };
};

export default function Settings({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "設定", href: "/app/settings" }],
        username,
      }}
      sidebarProps={{ role }}
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
