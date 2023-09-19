import { useState } from "react";
import dynamic from "next/dynamic";
const NotifyBoard = dynamic(() => import("../commons/NotifyBoard"), {
  ssr: false,
});
const Toasts = dynamic(() => import("../commons/Toasts"), {
  ssr: false,
});

export type NavbarProps = {
  breadcrumbs: { title: string; href: string }[];
  username: string;
};

export default function AppNavbar({ breadcrumbs, username }: NavbarProps) {
  const [isSideListOpen, setIsSideListOpen] = useState(false);

  return (
    <>
      <nav className="absolute left-0 top-0 z-10 flex w-full items-center bg-transparent py-4 md:flex-row md:flex-nowrap md:justify-start md:bg-slate-800">
        <div className="hidden w-full flex-wrap items-center justify-between px-4 md:flex md:flex-nowrap md:px-10">
          {/* Title */}
          <div className="flex flex-row gap-2">
            {breadcrumbs.map((page, index) => (
              <span key={page.title}>
                <a
                  href={page.href}
                  className="inline-block text-lg font-semibold uppercase text-white"
                >
                  {page.title}
                </a>
                {index !== breadcrumbs.length - 1 && (
                  <i className="fas fa-angle-right inline pl-2 text-slate-500"></i>
                )}
              </span>
            ))}
          </div>

          {/* User */}
          <ul className="hidden list-none flex-col items-center md:flex md:flex-row">
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <span className="inline-flex h-12 min-w-fit items-center justify-center text-lg text-white">
                {username}
              </span>
              <button
                className="cursor-pointer bg-transparent px-3 py-1 text-xs leading-none text-white opacity-70 transition-all hover:opacity-100"
                type="button"
                onClick={() => setIsSideListOpen((prev) => !prev)}
              >
                <i className="fas fa-bell text-xs text-white"></i>
              </button>
            </div>
          </ul>
        </div>
      </nav>

      {/* toast */}
      <Toasts />

      {/* message board */}
      {isSideListOpen && <NotifyBoard />}
    </>
  );
}
