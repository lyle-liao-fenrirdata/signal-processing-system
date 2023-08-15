import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { env } from "env.mjs";
import { Role } from "@prisma/client";
import { trpc } from "@/utils/trpc";

export type SidebarProps = {
  role: string;
  username: string;
};

const NavigationItem = ({
  href,
  target = "_self",
  title,
  currentPath,
  FaIconClass,
}: {
  href: string;
  target?: string;
  title: string;
  currentPath?: string;
  FaIconClass: string;
}) => (
  /* eslint-disable-next-line @next/next/no-html-link-for-pages */
  <a
    href={href}
    target={target}
    className={
      "group flex flex-row flex-nowrap items-center gap-1 py-3 text-xs font-bold " +
      (currentPath && currentPath.indexOf(href) !== -1
        ? "text-sky-600"
        : "text-slate-700 hover:text-sky-500")
    }
  >
    <span>
      <i
        className={`${FaIconClass} w-5 text-sm ${
          currentPath && currentPath.indexOf(href) !== -1
            ? "text-sky-600"
            : "opacity-25 group-hover:text-sky-500 group-hover:opacity-100"
        }`}
      ></i>
    </span>
    <span>{title}</span>
    {target !== "_self" && (
      <span className="ml-auto w-4">
        <i className="fas fa-arrow-up-right-from-square ml-1 text-xs opacity-75"></i>
      </span>
    )}
  </a>
);

export default function Sidebar({ role, username }: SidebarProps) {
  const router = useRouter();
  const [collapseShow, setCollapseShow] = React.useState("hidden");

  const { mutate: logout } = trpc.auth.logout.useMutation({
    retry: false,
    onSuccess: () => {
      router.replace("/auth/login");
    },
    onError: (error) => console.log(error),
  });

  return (
    <nav className="relative z-10 flex flex-wrap items-center justify-between bg-white px-6 py-4 shadow-xl md:fixed md:bottom-0 md:left-0 md:top-0 md:block md:w-40 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto">
      <div className="mx-auto flex w-full flex-wrap items-center justify-between px-0 md:min-h-full md:flex-col md:flex-nowrap md:items-stretch">
        {/* Toggler */}
        <button
          className="cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-black opacity-50 md:hidden"
          type="button"
          onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>
        {/* Brand */}
        <Link
          href="/"
          className="text-md mr-0 inline-block whitespace-nowrap p-4 px-0 text-left font-bold text-slate-600 md:block md:pb-2"
        >
          訊號處理系統
        </Link>
        {/* User */}
        <ul className="flex list-none flex-row items-center md:hidden">
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <span className="inline-flex h-12 min-w-fit items-center justify-center text-sm text-slate-500">
              {username}
            </span>
          </div>
        </ul>
        {/* Collapse */}
        <div
          className={
            "absolute left-0 right-0 top-0 z-40 h-auto flex-1 items-center overflow-y-auto overflow-x-hidden rounded shadow md:relative md:mt-4 md:flex md:flex-col md:items-stretch md:opacity-100 md:shadow-none " +
            collapseShow
          }
        >
          {/* Collapse header */}
          <div className="mb-4 block border-b border-solid border-slate-200 pb-4 md:hidden md:min-w-full">
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Link
                  href="/"
                  className="mr-0 inline-block whitespace-nowrap p-4 px-0 text-left text-sm font-bold text-slate-600 md:block md:pb-2"
                >
                  訊號處理系統
                </Link>
              </div>
              <div className="flex w-6/12 justify-end">
                <button
                  type="button"
                  className="cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none text-black opacity-50 md:hidden"
                  onClick={() => setCollapseShow("hidden")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}

          <ul className="flex list-none flex-col md:min-w-full md:flex-col">
            <li className="items-center">
              <NavigationItem
                href="/app/dashboard"
                title="儀表板"
                FaIconClass="fas fa-tv"
                currentPath={router.pathname}
              />
            </li>
            {(role === Role.ADMIN || role === Role.USER) && (
              <>
                <li className="items-center">
                  <NavigationItem
                    href="/app/search"
                    title="資料檢索"
                    FaIconClass="fas fa-bars-staggered"
                    currentPath={router.pathname}
                  />
                </li>

                <li className="items-center">
                  <NavigationItem
                    href="/app/audit"
                    title="稽核勾稽"
                    FaIconClass="fas fa-table"
                    currentPath={router.pathname}
                  />
                </li>

                <li className="items-center">
                  <NavigationItem
                    href={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_PORTAINER_PORT}`}
                    target="_blank"
                    title="容器叢集"
                    FaIconClass="fa-brands fa-docker"
                  />
                </li>

                {/* TODO: 需要更新 href 位置 */}
                <li className="items-center">
                  <NavigationItem
                    href={env.NEXT_PUBLIC_FACILITY_RESOURCE_LINK}
                    target="_blank"
                    title="RF設備及資源控制系統"
                    FaIconClass="fas fa-satellite-dish"
                  />
                </li>

                {/* TODO: 需要更新 href 位置 */}
                <li className="items-center">
                  <NavigationItem
                    href={env.NEXT_PUBLIC_FRONTEND_MANAGE_LINK}
                    target="_blank"
                    title="前端管理系統(5網)"
                    FaIconClass="fas fa-server"
                  />
                </li>
              </>
            )}
          </ul>

          <hr className="my-4 md:min-w-full" />

          <ul className="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
            {role === Role.ADMIN && (
              <li className="items-center">
                <NavigationItem
                  href="/app/permission"
                  title="權限管理"
                  FaIconClass="fas fa-user-shield"
                  currentPath={router.pathname}
                />
              </li>
            )}

            <li className="items-center">
              <NavigationItem
                href="/app/settings"
                title="設定"
                FaIconClass="fas fa-tools"
                currentPath={router.pathname}
              />
            </li>
          </ul>

          <hr className="my-4 md:min-w-full" />

          <ul className="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
            <li className="items-center">
              <button
                type="button"
                onClick={() => logout()}
                className="group flex w-full flex-row flex-nowrap items-center gap-1 py-3 text-xs font-bold text-slate-700 hover:text-sky-500 hover:opacity-100"
              >
                <span>
                  <i className="fas fa-right-from-bracket mr-2 text-xs text-slate-700 opacity-25 group-hover:text-sky-500 group-hover:opacity-100"></i>{" "}
                </span>
                <span>登出</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
