import { Fragment, useState } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";
import { Errors } from "@/components/commons/Errors";
import { formatDate } from "@/utils/formats";
import DropTableContainer from "@/components/commons/DropTableContainer";
import { getAuditGroupBgColor } from ".";

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

  const { isError, data, isLoading, error } =
    trpc.audit.getUserHistoryAuditLog.useQuery(undefined, {
      retry: false,
      retryOnMount: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    });

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
      ) : !data || !data.length ? (
        <span>無歷史紀錄</span>
      ) : (
        <DropTableContainer
          title={<>歷史紀錄</>}
          ths={["Record ID", "建立時間", "提交時間"]}
          tbodyTrs={data.map((log) => ({
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
              formatDate.format(log.createdAt),
              formatDate.format(
                Math.max(
                  Number(log.updatedAt),
                  ...data[0].auditGroupLogs
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
      )}
    </AdminLayout>
  );
}
