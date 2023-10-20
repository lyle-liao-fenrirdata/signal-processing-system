import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useState } from "react";
import SearchSql from "@/components/search/SearchSql";
import SearchKibana from "@/components/search/SearchKibana";

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
    props: { username: decodeURIComponent(username), role },
  };
};

export default function Search({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSqlTabActive, setIsSqlTabActive] = useState(false);
  const [isKibanaTabActive, setIsKibanaTabActive] = useState(true);

  function onTabClick(e: React.MouseEvent<HTMLButtonElement>) {
    const id = e.currentTarget.id;
    if (id === "sql2es-tab") {
      setIsSqlTabActive(true);
      setIsKibanaTabActive(false);
    } else if (id === "payload-tab") {
      setIsSqlTabActive(false);
      setIsKibanaTabActive(false);
    } else if (id === "session-tab") {
      setIsSqlTabActive(false);
      setIsKibanaTabActive(false);
    } else if (id === "kibana-tab") {
      setIsSqlTabActive(false);
      setIsKibanaTabActive(true);
    }
  }

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "資料檢索", href: "/app/search" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <div className="mb-4 border-b border-gray-200">
        <ul
          className="-mb-px flex flex-wrap text-center text-sm font-medium"
          role="tablist"
        >
          {[
            {
              id: "kibana-tab",
              text: "查詢解析資料",
              onClick: onTabClick,
              isSelected: isKibanaTabActive,
            },
            {
              id: "sql2es-tab",
              text: "SQL to ES / 其他檢索工具",
              onClick: onTabClick,
              isSelected: isSqlTabActive,
            },
          ].map(({ id, text, onClick, isSelected }) => (
            <li key={id} className="mr-2 last:mr-0" role="presentation">
              <button
                id={id}
                className="inline-block rounded-t-lg border-b-2 p-4 font-bold hover:text-sky-500 aria-selected:text-sky-600"
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={onClick}
              >
                {text}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="searchTabContent">
        {[
          {
            id: "kibana",
            children: <SearchKibana />,
            isSelected: isKibanaTabActive,
          },
          {
            id: "sql2es",
            children: <SearchSql />,
            isSelected: isSqlTabActive,
          },
        ].map(({ id, children, isSelected }) => (
          <div
            key={id}
            className="hidden aria-selected:block"
            aria-selected={isSelected}
          >
            {isSelected && children}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
