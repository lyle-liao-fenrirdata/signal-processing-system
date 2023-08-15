import React from "react";
import Link from "next/link";

export default function IndexNavbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <nav className="navbar-expand-lg fixed top-0 z-50 flex w-full flex-wrap items-center justify-between bg-white px-2 py-3 shadow">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
        <div className="relative flex w-full justify-between lg:static lg:block lg:w-auto lg:justify-start">
          <Link
            href="/"
            className="mr-4 inline-block whitespace-nowrap py-2 text-sm font-bold uppercase leading-relaxed text-slate-700"
          >
            訊號處理系統
          </Link>
          <button
            className="block cursor-pointer rounded border border-solid border-transparent bg-transparent px-3 py-1 text-xl leading-none outline-none focus:outline-none lg:hidden"
            type="button"
            onClick={() => setNavbarOpen(!navbarOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div
          className={
            "flex-grow items-center bg-white lg:flex lg:bg-opacity-0 lg:shadow-none" +
            (navbarOpen ? " block" : " hidden")
          }
          id="example-navbar-warning"
        >
          <ul className="mr-auto flex list-none flex-col lg:flex-row">
            <li className="flex items-center">
              <a
                className="flex items-center px-3 py-4 text-xs font-bold uppercase text-slate-700 hover:text-slate-500 lg:py-2"
                href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus?ref=nnjs-index-navbar"
              >
                <i className="far fa-file-alt leading-lg mr-2 text-lg text-slate-400" />{" "}
                Docs
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
