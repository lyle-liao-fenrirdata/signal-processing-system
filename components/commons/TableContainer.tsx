import React from "react";

const TableDropdown = () => (
  <a
    className="px-3 py-1 text-slate-500"
    href="#pablo"
    onClick={(e) => {
      e.preventDefault();
    }}
  >
    <i className="fas fa-ellipsis-v"></i>
  </a>
);

type TableContainer = {
  color: "light" | "dark";
  title: JSX.Element;
  ths: string[];
  tbodyTrs: {
    th: string;
    tds: JSX.Element[];
  }[];
};

export default function TableContainer({
  color,
  title,
  ths,
  tbodyTrs,
}: TableContainer) {
  return (
    <>
      <div
        className={
          "relative mb-6 flex w-full min-w-0 flex-col break-words rounded shadow-lg " +
          (color === "light" ? "bg-white" : "bg-slate-700 text-white")
        }
      >
        <div className="mb-0 rounded-t border-0 px-4 py-3">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-1 flex-grow px-4 text-lg font-semibold ">
              {title}
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="w-full border-collapse items-center bg-transparent">
            <thead>
              <tr>
                {ths.map((th) => (
                  <th
                    key={th}
                    className={
                      "whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase " +
                      (color === "light"
                        ? "border-slate-100 bg-slate-50 text-slate-500"
                        : "border-slate-500 bg-slate-600 text-slate-200")
                    }
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbodyTrs.map(({ th, tds }) => (
                <tr key={th}>
                  <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs">
                    <span
                      className={
                        "ml-3 font-bold " +
                        +(color === "light" ? "text-slate-600" : "text-white")
                      }
                    >
                      {th}
                    </span>
                  </th>
                  {tds.map((td, ind) => (
                    <td
                      key={`${th}-${ind}`}
                      className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
                    >
                      {td}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
