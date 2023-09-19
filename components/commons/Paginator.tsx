import React from "react";

export default function Paginator({
  pageButtonProps,
  totalRecordNumber,
}: {
  pageButtonProps: {
    disabled: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }[];
  totalRecordNumber: number;
}) {
  return (
    <nav className="flex w-full flex-row justify-center">
      <span className="mr-auto shrink-0 rounded px-2 text-xs leading-8 text-slate-500">
        共計 {totalRecordNumber} 筆結果
      </span>
      <ul className="flex list-none flex-wrap gap-2 rounded pl-0">
        {/* <li>
                <button
                  disabled={filterProps.page <= 1}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-solid border-slate-500 bg-white p-0 text-xs font-semibold leading-tight text-slate-500 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-white"
                  onClick={() =>
                    setFilterProps((prev) => ({ ...prev, page: 1 }))
                  }
                >
                  <i className="fas fa-chevron-left -ml-px"></i>
                  <i className="fas fa-chevron-left -ml-px"></i>
                </button>
              </li> */}
        {pageButtonProps.map(({ children, ...rest }) => (
          <li key={`paginator-page-${String(children)}`}>
            <button
              {...rest}
              className="relative h-8 w-8 rounded-full border border-solid border-slate-500 bg-white p-0 text-xs font-semibold leading-tight hover:opacity-70 disabled:bg-slate-500 disabled:text-white disabled:hover:opacity-100"
            >
              {children}
            </button>
          </li>
        ))}
        {/* <li>
                <button
                  disabled={
                    filterProps.page >=
                    Math.ceil(data.count.id / adminAuditLogPageSize)
                  }
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-solid border-slate-500 bg-white p-0 text-xs font-semibold leading-tight text-slate-500 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-white"
                  onClick={() =>
                    setFilterProps((prev) => ({
                      ...prev,
                      page: Math.ceil(data.count.id / adminAuditLogPageSize),
                    }))
                  }
                >
                  <i className="fas fa-chevron-right -mr-px"></i>
                  <i className="fas fa-chevron-right -mr-px"></i>
                </button>
              </li> */}
      </ul>
    </nav>
  );
}
