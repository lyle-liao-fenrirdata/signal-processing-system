import { ReactElement } from "react";

export const Container = ({
  title,
  children,
}: {
  title: JSX.Element;
  children: ReactElement;
}) => (
  <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded border-0 bg-slate-100 shadow-lg">
    <div className="mb-0 rounded-t bg-white p-6">{title}</div>
    <div className="flex-auto px-4 py-10 pt-3 lg:px-10">{children}</div>
  </div>
);
