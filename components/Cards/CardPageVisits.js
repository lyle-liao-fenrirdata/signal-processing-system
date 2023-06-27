import React from "react";

// components

export default function CardPageVisits() {
  return (
    <>
      <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg">
        <div className="mb-0 rounded-t border-0 px-4 py-3">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-1 flex-grow px-4">
              <h3 className="text-base font-semibold text-slate-700">
                Page visits
              </h3>
            </div>
            <div className="relative w-full max-w-full flex-1 flex-grow px-4 text-right">
              <button
                className="mb-1 mr-1 rounded bg-indigo-500 px-3 py-1 text-xs font-bold uppercase text-white outline-none transition-all duration-150 ease-linear focus:outline-none active:bg-indigo-600"
                type="button"
              >
                See all
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="w-full border-collapse items-center bg-transparent">
            <thead>
              <tr>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-slate-500">
                  Page name
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-slate-500">
                  Visitors
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-slate-500">
                  Unique users
                </th>
                <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-slate-500">
                  Bounce rate
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  /argon/
                </th>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  4,569
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  340
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  <i className="fas fa-arrow-up mr-4 text-emerald-500"></i>
                  46,53%
                </td>
              </tr>
              <tr>
                <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  /argon/index.html
                </th>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  3,985
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  319
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  <i className="fas fa-arrow-down mr-4 text-orange-500"></i>
                  46,53%
                </td>
              </tr>
              <tr>
                <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  /argon/charts.html
                </th>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  3,513
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  294
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  <i className="fas fa-arrow-down mr-4 text-orange-500"></i>
                  36,49%
                </td>
              </tr>
              <tr>
                <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  /argon/tables.html
                </th>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  2,050
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  147
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  <i className="fas fa-arrow-up mr-4 text-emerald-500"></i>
                  50,87%
                </td>
              </tr>
              <tr>
                <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                  /argon/profile.html
                </th>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  1,795
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  190
                </td>
                <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs">
                  <i className="fas fa-arrow-down mr-4 text-red-500"></i>
                  46,53%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
