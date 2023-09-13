import { ReactNode } from "react";

type DropTableProp = {
  title: JSX.Element;
  ths: string[];
  tbodyTrs: {
    key: string;
    onClick: () => void;
    content: ReactNode | undefined;
    tds: string[];
  }[];
};

export default function DropTableContainer({
  title,
  ths,
  tbodyTrs,
}: DropTableProp) {
  return (
    <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg">
      <div className="mb-0 rounded-t border-0 px-4 py-3">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-1 flex-grow px-4 text-lg font-semibold ">
            {title}
          </div>
        </div>
      </div>
      <div className="block w-full overflow-x-auto">
        <table className="w-full border-collapse items-center bg-transparent">
          <thead>
            <tr>
              {ths.map((th) => (
                <th
                  key={th}
                  className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold uppercase text-slate-500"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbodyTrs.map(({ key, onClick, content, tds }) => (
              <tr
                key={key}
                className="cursor-pointer hover:bg-slate-100"
                onClick={onClick}
              >
                {tds.map((td, ind) => (
                  <td
                    key={`${key}-${ind}`}
                    className="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
                  >
                    {td}
                  </td>
                ))}
                {content && <td colSpan={ths.length}>{content}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
