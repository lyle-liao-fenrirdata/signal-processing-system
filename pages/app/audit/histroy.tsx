import { Fragment, useState } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";
import { Errors } from "@/components/commons/Errors";
import { formatDateTime } from "@/utils/formats";
import DropTableContainer from "@/components/commons/DropTableContainer";
import { getAuditGroupBgColor } from ".";

export const userAuditLogPageSize = 10;

export const getServerSideProps: GetServerSideProps<{
  username: string;
  role: string;
}> = async ({ req }) => {
  const username = req.headers["x-username"];
  const role = req.headers["x-role"];

  if (typeof username !== "string" || typeof role !== "string") {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: { username: decodeURIComponent(username), role },
  };
};

export default function History({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [activeIds, setActiveIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { isError, data, isLoading, error } =
    trpc.audit.getUserHistoryAuditLog.useQuery(
      { page },
      {
        retry: false,
        retryOnMount: false,
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
      }
    );

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [
          { title: "稽核勾稽", href: "/app/audit" },
          { title: "歷史紀錄", href: "/app/audit/history" },
        ],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      {isLoading ? (
        <span>Fetching... Loading...</span>
      ) : isError ? (
        <Errors errors={[error?.message]} />
      ) : !data || !data.auditLog.length ? (
        <span>無歷史紀錄</span>
      ) : (
        <>
          <DropTableContainer
            title={<>歷史紀錄</>}
            ths={["Record ID", "建立時間", "提交時間"]}
            tbodyTrs={data.auditLog.map((log) => ({
              key: `history-${log.id}`,
              onClick: () =>
                setActiveIds((prev) => {
                  if (prev.includes(log.id)) {
                    return prev.filter((id) => id !== log.id);
                  }
                  return [...prev, log.id];
                }),
              content: activeIds.includes(log.id) ? (
                <div className="grid grid-cols-12 gap-4 rounded bg-slate-100 p-6">
                  <span className="col-span-12 block w-full rounded">
                    <span className="block text-sm font-semibold text-gray-900">
                      上機概要
                    </span>
                    <span className="block text-xs">
                      {log.audit.comment ?? ""}
                    </span>
                  </span>
                  {log.auditGroupLogs.map((group) => (
                    <Fragment key={`histroy-auditGroupLog-${group.id}`}>
                      <div
                        className={`col-span-3 flex items-center justify-center rounded ${getAuditGroupBgColor(
                          group.auditGroup.color
                        )}`}
                      >
                        <span className="inline-block px-3 py-1 text-sm font-semibold">
                          {group.auditGroup.name}
                        </span>
                      </div>
                      <div className="col-span-5 flex flex-col justify-center gap-2">
                        {group.auditItemLogs.map((item) => (
                          <div
                            key={`history-auditItemLog-${item.id}`}
                            className="items-top relative flex flex-nowrap items-center space-x-2"
                          >
                            <input
                              id={`auditItemLog-input-${item.id}`}
                              type="checkbox"
                              disabled
                              className="h-3 w-3 rounded border-none border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
                              checked={item.isChecked}
                            />
                            <label
                              htmlFor={`auditItemLog-input-${item.id}`}
                              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.auditItem.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="col-span-4">
                        <textarea
                          id="message"
                          rows={4}
                          disabled
                          className="block w-full rounded-lg border-none border-gray-300 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          value={group.description || ""}
                        ></textarea>
                      </div>
                    </Fragment>
                  ))}
                  <div className="col-span-12">
                    <textarea
                      id="message"
                      rows={4}
                      disabled
                      className="block w-full rounded-lg border-none border-gray-300 bg-gray-50 p-2.5 text-xs text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      value={log.description || ""}
                    ></textarea>
                  </div>
                </div>
              ) : undefined,
              tds: [
                String(log.id),
                formatDateTime.format(log.createdAt),
                formatDateTime.format(
                  Math.max(
                    Number(log.updatedAt),
                    ...log.auditGroupLogs
                      .map((g) =>
                        [
                          g.updatedAt,
                          ...g.auditItemLogs.map((i) => i.updatedAt),
                        ].flat()
                      )
                      .flat()
                      .map((d) => Number(d))
                  )
                ),
              ],
            }))}
          />
          <nav className="flex flex-row justify-center">
            <ul className="flex list-none flex-wrap gap-2 rounded pl-0">
              <li>
                <button
                  disabled={page <= 1}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-solid border-slate-500 bg-white p-0 text-xs font-semibold leading-tight text-slate-500 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-white"
                  onClick={() => setPage(() => 1)}
                >
                  <i className="fas fa-chevron-left -ml-px"></i>
                  <i className="fas fa-chevron-left -ml-px"></i>
                </button>
              </li>
              {Array.from({
                length: Math.ceil(data.count.id / userAuditLogPageSize),
              }).map((_, c) => (
                <li key={`paginator-page-${c + 1}`}>
                  <button
                    disabled={c + 1 === page}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border border-solid border-slate-500 bg-white p-0 text-xs font-semibold leading-tight disabled:bg-slate-500 disabled:text-white"
                    onClick={() => setPage(() => c + 1)}
                  >
                    {c + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  disabled={
                    page >= Math.ceil(data.count.id / userAuditLogPageSize)
                  }
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border border-solid border-slate-500 bg-white p-0 text-xs font-semibold leading-tight text-slate-500 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-white"
                  onClick={() =>
                    setPage(() =>
                      Math.ceil(data.count.id / userAuditLogPageSize)
                    )
                  }
                >
                  <i className="fas fa-chevron-right -mr-px"></i>
                  <i className="fas fa-chevron-right -mr-px"></i>
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </AdminLayout>
  );
}
