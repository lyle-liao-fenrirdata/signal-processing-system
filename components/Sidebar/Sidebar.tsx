import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { env } from "env.mjs";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const router = useRouter();
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
        <ul className="flex list-none flex-wrap items-center md:hidden">
          <li className="relative inline-block">
            <a className="block text-slate-500" href="#pablo">
              <div className="flex items-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm">
                  USERNAME
                </span>
              </div>
            </a>
          </li>
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
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a
                href="/admin/dashboard"
                className={
                  "block py-3 text-xs font-bold " +
                  (router.pathname.indexOf("/admin/dashboard") !== -1
                    ? "text-sky-500 hover:text-sky-600"
                    : "text-slate-700 hover:text-slate-500")
                }
              >
                <i
                  className={
                    "fas fa-tv mr-2 text-sm " +
                    (router.pathname.indexOf("/admin/dashboard") !== -1
                      ? "opacity-75"
                      : "text-slate-300")
                  }
                ></i>{" "}
                儀錶板
              </a>
            </li>

            <li className="items-center">
              <Link
                href="/admin/search"
                className={
                  "block py-3 text-xs font-bold " +
                  (router.pathname.indexOf("/admin/search") !== -1
                    ? "text-sky-500 hover:text-sky-600"
                    : "text-slate-700 hover:text-slate-500")
                }
              >
                <i
                  className={
                    "fas fa-bars-staggered mr-2 text-sm " +
                    (router.pathname.indexOf("/admin/search") !== -1
                      ? "opacity-75"
                      : "text-slate-300")
                  }
                ></i>{" "}
                資料檢索
              </Link>
            </li>

            <li className="items-center">
              <Link
                href="/admin/audit"
                className={
                  "block py-3 text-xs font-bold " +
                  (router.pathname.indexOf("/admin/audit") !== -1
                    ? "text-sky-500 hover:text-sky-600"
                    : "text-slate-700 hover:text-slate-500")
                }
              >
                <i
                  className={
                    "fas fa-table mr-2 text-sm " +
                    (router.pathname.indexOf("/admin/audit") !== -1
                      ? "opacity-75"
                      : "text-slate-300")
                  }
                ></i>{" "}
                稽核勾稽
              </Link>
            </li>

            <li className="items-center">
              <a
                href={`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_PORTAINER_PORT}`}
                target="_blank"
                className="block py-3 text-xs font-bold text-slate-700 hover:text-slate-500"
              >
                <i className="fa-brands fa-docker mr-2 text-sm text-slate-300"></i>{" "}
                容器叢集{" "}
                <i className="fas fa-arrow-up-right-from-square ml-1 text-xs opacity-75"></i>
              </a>
            </li>

            {/* TODO: 需要更新 href 位置 */}
            <li className="items-center">
              <a
                href={`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_PORTAINER_PORT}`}
                target="_blank"
                className="block py-3 text-xs font-bold text-slate-700 hover:text-slate-500"
              >
                <i className="fas fa-server mr-2 text-sm text-slate-300"></i>{" "}
                資源管理{" "}
                <i className="fas fa-arrow-up-right-from-square ml-1 text-xs opacity-75"></i>
              </a>
            </li>

            {/* TODO: 還需要嗎? 如要，需更新 href 位置 */}
            {/* <li className="items-center">
              <a
                href={`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_PORTAINER_PORT}`}
                target="_blank"
                className="block py-3 text-xs font-bold text-slate-700 hover:text-slate-500"
              >
                <i className="fa-brands fa-ubuntu mr-2 text-sm text-slate-300"></i>{" "}
                系統操控{" "}
                <i className="fas fa-arrow-up-right-from-square ml-1 text-xs opacity-75"></i>
              </a>
            </li> */}

            <li className="items-center">
              <Link
                href="/admin/settings"
                className={
                  "block py-3 text-xs font-bold " +
                  (router.pathname.indexOf("/admin/settings") !== -1
                    ? "text-sky-500 hover:text-sky-600"
                    : "text-slate-700 hover:text-slate-500")
                }
              >
                <i
                  className={
                    "fas fa-user-shield mr-2 text-sm " +
                    (router.pathname.indexOf("/admin/settings") !== -1
                      ? "opacity-75"
                      : "text-slate-300")
                  }
                ></i>{" "}
                權限管理
              </Link>
            </li>

            <li className="items-center">
              <Link
                href="/admin/settings"
                className={
                  "block py-3 text-xs font-bold " +
                  (router.pathname.indexOf("/admin/settings") !== -1
                    ? "text-sky-500 hover:text-sky-600"
                    : "text-slate-700 hover:text-slate-500")
                }
              >
                <i
                  className={
                    "fas fa-tools mr-2 text-sm " +
                    (router.pathname.indexOf("/admin/settings") !== -1
                      ? "opacity-75"
                      : "text-slate-300")
                  }
                ></i>{" "}
                設定
              </Link>
            </li>
          </ul>

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />
          {/* Heading */}

          <ul className="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
            <li className="items-center">
              <Link
                href="/auth/login"
                className="block py-3 text-xs font-bold text-slate-700 hover:text-slate-500"
              >
                <i className="fas fa-fingerprint mr-2 text-sm text-slate-400"></i>{" "}
                登入
              </Link>
            </li>

            <li className="items-center">
              <Link
                href="/auth/register"
                className="block py-3 text-xs font-bold text-slate-700 hover:text-slate-500"
              >
                <i className="fas fa-clipboard-list mr-2 text-sm text-slate-300"></i>{" "}
                註冊
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
