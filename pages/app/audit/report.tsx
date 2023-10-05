import { Fragment, useState } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";
import { Errors } from "@/components/commons/Errors";
import { formatDateTime, formatDate } from "@/utils/formats";
import DropTableContainer from "@/components/commons/DropTableContainer";
import { getAuditGroupBgColor } from ".";
import { Role } from "@prisma/client";
import { AuditLogQueryInput } from "@/server/schema/audit.schema";
import Paginator from "@/components/commons/Paginator";

export const adminAuditLogPageSize = 10;

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

export default function Report({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [activeIds, setActiveIds] = useState<number[]>([]);
  const [isUseFilter, setIsUseFilter] = useState(false);
  const [filterProps, setFilterProps] = useState<AuditLogQueryInput>({
    page: 1,
  });
  const { isError, data, isLoading, error } =
    trpc.audit.getAllAuditLog.useQuery(
      isUseFilter ? filterProps : { page: filterProps.page },
      {
        retry: false,
        retryOnMount: false,
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
      }
    );

  const tbodyTrs = (
    d: Exclude<typeof data, undefined>["audit"],
    isUseFilter: boolean
  ) => {
    const empty = [
      {
        key: "history-empty",
        onClick: () => {},
        content: undefined,
        tds: ["沒有資料"],
      },
    ];
    const mainData = d.map((log) => ({
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
            <span className="block whitespace-pre-line text-xs">
              {log.audit.comment ?? ""}
            </span>
          </span>
          {log.auditGroupLogs.map((group) => (
            <Fragment key={`histroy-audit-group-log-${group.id}`}>
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
                    key={`history-audit-item-log-${item.id}`}
                    className="items-top relative flex flex-nowrap items-center space-x-2"
                  >
                    <input
                      id={`history-audit-item-log-input-${item.id}`}
                      type="checkbox"
                      readOnly
                      className="h-3 w-3 rounded border-none border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
                      checked={item.isChecked}
                      defaultChecked={item.isChecked}
                    />
                    <label
                      htmlFor={`history-audit-item-log-input-${item.id}`}
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
        String(`${log.user.username} (${log.user.account})`),
        String(log.user.role),
        formatDateTime.format(log.createdAt),
        log.isLocked ? "✔️ 是" : "❗否",
        log.isLocked
          ? formatDateTime.format(log.updatedAt)
          : formatDateTime.format(
              Math.max(
                Number(log.updatedAt),
                ...log.auditGroupLogs
                  .map(({ updatedAt, auditItemLogs }) =>
                    [
                      updatedAt,
                      ...auditItemLogs.map(({ updatedAt }) => updatedAt),
                    ].flat()
                  )
                  .flat()
                  .map((d) => Number(d))
              )
            ),
      ],
    }));
    if (!isUseFilter) return mainData;
    return [
      {
        key: "history-filter",
        onClick: () => {},
        content: undefined,
        tds: [
          <button
            key="filter-clean"
            className="ml-auto mt-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
            type="button"
            onClick={() => setFilterProps(({ page }) => ({ page: 1 }))}
          >
            清除
          </button>,
          <select
            key="filter-user"
            name="filter-user"
            id="filter-user"
            className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
            value={filterProps.account || ""}
            onChange={(e) =>
              setFilterProps((prev) => ({
                ...prev,
                account: e.target.value,
                page: 1,
              }))
            }
          >
            <option value="">無</option>
            {d
              .map(({ user }) => `${user.username} (${user.account})`)
              .filter((usr, ind, arr) => arr.indexOf(usr) === ind)
              .map((userString) => (
                <option
                  key={`filter-user-option-${userString}`}
                  value={userString.slice(userString.indexOf("(") + 1, -1)}
                >
                  {userString}
                </option>
              ))}
          </select>,
          <select
            key="filter-role"
            name="filter-role"
            id="filter-role"
            className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
            value={filterProps.role || ""}
            onChange={(e) =>
              setFilterProps((prev) => ({
                ...prev,
                role: (!e.target.value ? undefined : e.target.value) as Role,
                page: 1,
              }))
            }
          >
            <option value="">無</option>
            <option value={Role.GUEST}>GUEST</option>
            <option value={Role.USER}>USER</option>
            <option value={Role.ADMIN}>ADMIN</option>
          </select>,
          <div key="filter-createAt" className="flex flex-col gap-2">
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <label htmlFor="filter-createAt-start">起</label>
              <input
                type="date"
                id="filter-createAt-start"
                name="filter-createAt-start"
                value={
                  (filterProps.createAtFrom &&
                    formatDate(filterProps.createAtFrom)) ||
                  ""
                }
                onChange={(e) =>
                  setFilterProps((prev) => ({
                    ...prev,
                    createAtFrom: new Date(e.target.value),
                    page: 1,
                  }))
                }
                onKeyDown={(e) => e.preventDefault()}
                min="2023-06-01"
                max={formatDate()}
                className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
              />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <label htmlFor="filter-createAt-end">訖</label>
              <input
                type="date"
                id="filter-createAt-end"
                name="filter-createAt-end"
                value={
                  (filterProps.createAtTo &&
                    formatDate(filterProps.createAtTo)) ||
                  ""
                }
                onChange={(e) =>
                  setFilterProps((prev) => ({
                    ...prev,
                    createAtTo: new Date(e.target.value),
                    page: 1,
                  }))
                }
                onKeyDown={(e) => e.preventDefault()}
                min="2023-06-01"
                max={formatDate()}
                className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
              />
            </div>
          </div>,
          <select
            key="filter-isActive"
            name="filter-isActive"
            id="filter-isActive"
            className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
            value={
              filterProps.isLock === true
                ? "true"
                : filterProps.isLock === false
                ? "false"
                : ""
            }
            onChange={(e) =>
              setFilterProps((prev) => ({
                ...prev,
                isLock: !e.target.value ? undefined : e.target.value === "true",
                page: 1,
              }))
            }
          >
            <option value="">無</option>
            <option value="true">已提交</option>
            <option value="false">未提交</option>
          </select>,
          <div key="filter-createAt" className="flex flex-col gap-2">
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <label htmlFor="filter-updatedAt-start">起</label>
              <input
                type="date"
                id="filter-updatedAt-start"
                name="filter-updatedAt-start"
                value={
                  (filterProps.updatedAtFrom &&
                    formatDate(filterProps.updatedAtFrom)) ||
                  ""
                }
                onChange={(e) =>
                  setFilterProps((prev) => ({
                    ...prev,
                    updatedAtFrom: new Date(e.target.value),
                    page: 1,
                  }))
                }
                onKeyDown={(e) => e.preventDefault()}
                min="2023-06-01"
                max={formatDate()}
                className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
              />
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <label htmlFor="filter-updatedAt-end">訖</label>
              <input
                type="date"
                id="filter-updatedAt-end"
                name="filter-updatedAt-end"
                value={
                  (filterProps.updateAtTo &&
                    formatDate(filterProps.updateAtTo)) ||
                  ""
                }
                onChange={(e) =>
                  setFilterProps((prev) => ({
                    ...prev,
                    updateAtTo: new Date(e.target.value),
                    page: 1,
                  }))
                }
                onKeyDown={(e) => e.preventDefault()}
                min="2023-06-01"
                max={formatDate()}
                className="rounded border border-slate-700 text-xs outline-none focus:outline-none"
              />
            </div>
          </div>,
        ],
      },
      ...(!mainData.length ? empty : mainData),
    ];
  };

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [
          { title: "稽核勾稽", href: "/app/audit" },
          { title: "登載紀錄", href: "/app/audit/report" },
        ],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      {isLoading ? (
        <span>Fetching... Loading...</span>
      ) : isError ? (
        <Errors errors={[error?.message]} />
      ) : !data ? (
        <span>登載紀錄</span>
      ) : (
        <>
          <DropTableContainer
            title={
              <div className="flex items-center justify-between">
                <h6 className="font-bold text-slate-700">登載紀錄</h6>
                <div className="flex items-center gap-2 px-4 py-2 text-sm">
                  <input
                    id="isUseFilter"
                    name="isUseFilter"
                    checked={isUseFilter}
                    className="h-4 w-4 cursor-pointer rounded border border-slate-700 text-xs outline-none focus:outline-none"
                    type="checkbox"
                    onChange={() => {
                      setIsUseFilter((prev) => !prev);
                    }}
                  />
                  <label htmlFor="isUseFilter" className="cursor-pointer">
                    篩選
                  </label>
                </div>
              </div>
            }
            ths={[
              "Record ID",
              "建立人員(帳號)",
              "權限",
              "建立時間",
              "已提交",
              "最後變更時間",
            ]}
            tbodyTrs={tbodyTrs(data.audit, isUseFilter)}
          />
          <Paginator
            totalRecordNumber={data.count.id}
            pageButtonProps={Array.from({
              length: Math.ceil(data.count.id / adminAuditLogPageSize),
            }).map((_, c) => ({
              disabled: c + 1 === filterProps.page,
              onClick: () =>
                setFilterProps((prev) => ({ ...prev, page: c + 1 })),
              children: c + 1,
            }))}
          />
        </>
      )}
    </AdminLayout>
  );
}
