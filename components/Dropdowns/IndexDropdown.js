import React from "react";
import Link from "next/link";
import { createPopper } from "@popperjs/core";

const IndexDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="flex items-center px-3 py-4 text-xs font-bold uppercase text-slate-700 hover:text-slate-500 lg:py-2"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        Demo Pages
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "z-50 float-left min-w-48 list-none rounded bg-white py-2 text-left text-base shadow-lg"
        }
      >
        <span
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 pb-0 pt-2 text-sm font-bold text-slate-400"
          }
        >
          Admin Layout
        </span>
        <Link
          href="/admin/dashboard"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Dashboard
        </Link>
        <Link
          href="/admin/settings"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        ></Link>
        <Link
          href="/admin/tables"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Tables
        </Link>
        <Link
          href="/admin/maps"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Maps
        </Link>
        <div className="mx-4 my-2 h-0 border border-solid border-slate-100" />
        <span
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 pb-0 pt-2 text-sm font-bold text-slate-400"
          }
        >
          Auth Layout
        </span>
        <Link
          href="/auth/login"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Register
        </Link>
        <div className="mx-4 my-2 h-0 border border-solid border-slate-100" />
        <span
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 pb-0 pt-2 text-sm font-bold text-slate-400"
          }
        >
          No Layout
        </span>
        <Link
          href="/landing"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Landing
        </Link>
        <Link
          href="/profile"
          className={
            "block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-slate-700"
          }
        >
          Profile
        </Link>
      </div>
    </>
  );
};

export default IndexDropdown;
