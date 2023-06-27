import React from "react";

// components

export default function CardSettings() {
  return (
    <>
      <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 bg-slate-100 shadow-lg">
        <div className="mb-0 rounded-t bg-white px-6 py-6">
          <div className="flex justify-between text-center">
            <h6 className="text-xl font-bold text-slate-700">My account</h6>
            <button
              className="mr-1 rounded bg-slate-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
              type="button"
            >
              Settings
            </button>
          </div>
        </div>
        <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
          <form>
            <h6 className="mb-6 mt-3 text-sm font-bold uppercase text-slate-400">
              User Information
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="lucky.jesse"
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="jesse@example.com"
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="Lucky"
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="Jesse"
                  />
                </div>
              </div>
            </div>

            <hr className="border-b-1 mt-6 border-slate-300" />

            <h6 className="mb-6 mt-3 text-sm font-bold uppercase text-slate-400">
              Contact Information
            </h6>
            <div className="flex flex-wrap">
              <div className="lg:w-12/12 w-full px-4">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-4/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    City
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="New York"
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-4/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="United States"
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-4/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue="Postal Code"
                  />
                </div>
              </div>
            </div>

            <hr className="border-b-1 mt-6 border-slate-300" />

            <h6 className="mb-6 mt-3 text-sm font-bold uppercase text-slate-400">
              About Me
            </h6>
            <div className="flex flex-wrap">
              <div className="lg:w-12/12 w-full px-4">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    About me
                  </label>
                  <textarea
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    rows="4"
                    defaultValue="A beautiful UI Kit and Admin for NextJS & Tailwind CSS. It is Free
                    and Open Source."
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
