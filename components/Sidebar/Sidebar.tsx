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
  onClick = () => {},
}: {
  href: string;
  target?: string;
  title: string | JSX.Element;
  currentPath: string;
  FaIconClass: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}) => (
  /* eslint-disable-next-line @next/next/no-html-link-for-pages */
  <a
    href={href}
    target={target}
    className={
      "group flex flex-row flex-nowrap items-center gap-1 py-3 text-xs font-bold " +
      ((href === "/app" ? currentPath === href : currentPath.includes(href))
        ? "text-sky-600"
        : "text-slate-700 hover:text-sky-500")
    }
    onClick={onClick}
  >
    <span>
      <i
        className={`${FaIconClass} w-5 text-sm ${
          (href === "/app" ? currentPath === href : currentPath.includes(href))
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

  const { isSuccess, data, refetch } = trpc.auth.getCookie.useQuery(undefined, {
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });

  const {
    isError: isGetIsStoreImageError,
    data: getIsStoreImageData,
    isLoading: isGetIsStoreImageLoading,
    refetch: refetchIsStoreImage,
  } = trpc.analyzer.getIsStoreImage.useQuery(undefined, {
    retry: false,
    retryOnMount: false,
    refetchOnMount: true,
    refetchInterval: 5000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  });

  const { mutate: setIsStoreImage, isLoading: setIsStoreImageLoading } =
    trpc.analyzer.setIsStoreImage.useMutation({
      retry: false,
      onSuccess: () => {
        refetchIsStoreImage();
      },
      onError: (error) => console.log(error),
    });

  const { mutate: logout } = trpc.auth.logout.useMutation({
    retry: false,
    onSuccess: () => {
      router.replace("/auth/login");
    },
    onError: (error) => console.log(error),
  });

  function openOtherSiteLnck(
    path: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (isSuccess && data && data.token) {
      const tgt = new URL(
        path,
        window?.location?.origin || "https://172.16.16.31"
      );
      tgt.searchParams.append("token", data.token);
      window.open(tgt, "_blank");
    } else {
      console.log(data?.error);
      refetch();
    }
  }

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
                href="/app"
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

                {!env.NEXT_PUBLIC_IS_PORTABLE_SYSTEM && (
                  <li className="items-center">
                    <NavigationItem
                      href="/app/audit"
                      title="稽核勾稽"
                      FaIconClass="fas fa-table"
                      currentPath={router.pathname}
                    />
                  </li>
                )}

                <li className="items-center">
                  <NavigationItem
                    href={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_PORTAINER_PORT}`}
                    target="_blank"
                    title="容器叢集"
                    currentPath={router.pathname}
                    FaIconClass="fa-brands fa-docker"
                  />
                </li>

                <li className="items-center">
                  <NavigationItem
                    href="/RFManage"
                    target="_blank"
                    title="RF設備及資源控制系統"
                    currentPath={router.pathname}
                    FaIconClass="fas fa-satellite-dish"
                    onClick={(e) => {
                      openOtherSiteLnck("/RFManage", e);
                    }}
                  />
                </li>

                <li className="items-center">
                  <NavigationItem
                    href="/SysMonitor"
                    target="_blank"
                    title={
                      <>
                        前端管理
                        <br />
                        系統(5網)
                      </>
                    }
                    currentPath={router.pathname}
                    FaIconClass="fas fa-server"
                    onClick={(e) => {
                      openOtherSiteLnck("/SysMonitor", e);
                    }}
                  />
                </li>
              </>
            )}
          </ul>

          <hr className="my-4 md:min-w-full" />

          <ul className="flex list-none flex-col md:mb-4 md:min-w-full md:flex-col">
            {!env.NEXT_PUBLIC_IS_PORTABLE_SYSTEM && (
              <li className="items-center">
                <NavigationItem
                  href="/app/files"
                  title="檔案管理"
                  FaIconClass="fas fa-leaf"
                  currentPath={router.pathname}
                />
              </li>
            )}
            {role === Role.ADMIN && (
              <>
                <li className="items-center">
                  <NavigationItem
                    href="/app/permission"
                    title="權限管理"
                    FaIconClass="fas fa-user-shield"
                    currentPath={router.pathname}
                  />
                </li>
                {!env.NEXT_PUBLIC_IS_PORTABLE_SYSTEM && (
                  <li className="items-center">
                    <NavigationItem
                      href="/app/registry"
                      title="Register Image"
                      FaIconClass="fas fa-cubes-stacked"
                      currentPath={router.pathname}
                    />
                  </li>
                )}
              </>
            )}

            <li className="items-center">
              <NavigationItem
                href="/app/settings"
                title="個人設定"
                FaIconClass="fas fa-tools"
                currentPath={router.pathname}
              />
            </li>

            {(role === Role.ADMIN || role === Role.USER) && (
              <li className="pt-3">
                <label className="relative inline-flex cursor-pointer items-center font-bold">
                  <input
                    type="checkbox"
                    value=""
                    className="peer sr-only"
                    disabled={
                      isGetIsStoreImageError ||
                      isGetIsStoreImageLoading ||
                      setIsStoreImageLoading
                    }
                    checked={
                      getIsStoreImageData?.ok &&
                      getIsStoreImageData.data._source?.store_image
                    }
                    onChange={(e) => setIsStoreImage(e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-0"></div>
                  <span className="ml-1 text-sm font-medium">過濾圖檔</span>
                </label>
              </li>
            )}
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
