import React from "react";

import CardTable from "components/Cards/CardTable.js";

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

export default function Audit({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "稽核勾稽", href: "/app/audit" }],
        username,
      }}
      sidebarProps={{ role }}
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
