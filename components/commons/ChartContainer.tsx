import { ReactElement } from "react";

export const ChartContainer = ({
  title,
  children,
}: {
  title: JSX.Element;
  children: ReactElement;
}) => (
  <div className="flex flex-wrap">
    <div className="relative my-4 h-[calc(100%-1.5rem)] w-full break-words rounded bg-white shadow-lg">
      <div className="w-full overflow-x-auto p-4">
        <span className="text-md absolute -left-2 -top-4 inline-block min-w-48 rounded bg-slate-600 px-2 py-1 font-semibold text-white drop-shadow-lg">
          {title}
        </span>
        {children}
      </div>
    </div>
  </div>
);
