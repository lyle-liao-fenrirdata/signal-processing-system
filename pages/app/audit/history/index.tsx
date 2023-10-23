import { Fragment, useState } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";
import { Errors } from "@/components/commons/Errors";
import { formatDateTime } from "@/utils/formats";
import DropTableContainer from "@/components/commons/DropTableContainer";
import { getAuditGroupBgColor } from "..";
import Paginator from "@/components/commons/Paginator";
import Modal from "@/components/commons/Modal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState("");
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  function closeDeleteModal() {
    setIsDeleteModalOpen("");
  }

  const { isError, data, isLoading, error, refetch } =
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

  const { mutate: deleteAuditLog, isLoading: isDeleteAuditLogLoading } =
    trpc.audit.deleteAuditLog.useMutation({
      retry: false,
      onSuccess: () => {
        refetch();
        setIsDeleteModalOpen("");
      },
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
      ) : !data || !data.auditLog.length ? (
        <span>無歷史紀錄</span>
      ) : (
        <>
          <DropTableContainer
            title={<>歷史紀錄</>}
            ths={["Record ID", "建立時間", "最後變更時間", "編輯"]}
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
                    <span className="block whitespace-pre-line text-xs">
                      {log.audit.comment ?? ""}
                    </span>
                  </span>
                  {log.auditGroupLogs.map((group) => (
                    <Fragment key={`history-auditGroupLog-${group.id}`}>
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
                log.isLocked ? (
                  "已提交，不可編輯。"
                ) : (
                  <div className="flex w-full flex-row flex-nowrap items-center gap-3">
                    <a
                      href={`/app/audit/history/${log.id}`}
                      className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600 disabled:opacity-50"
                    >
                      編輯
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteModalOpen(log.id);
                      }}
                      className="mr-2 rounded bg-red-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-red-600 disabled:opacity-50"
                    >
                      刪除
                    </button>
                  </div>
                ),
              ],
            }))}
          />
          <Paginator
            totalRecordNumber={data.count.id}
            pageButtonProps={Array.from({
              length: Math.ceil(data.count.id / userAuditLogPageSize),
            }).map((_, c) => ({
              disabled: c + 1 === page,
              onClick: () => setPage(() => c + 1),
              children: c + 1,
            }))}
          />
        </>
      )}

      {isDeleteModalOpen && (
        <Modal
          header="刪除表單"
          actions={[
            <button
              disabled={isDeleteAuditLogLoading}
              key={`save audit change`}
              className="mr-2 rounded bg-red-700 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-600"
              type="button"
              onClick={() => {
                if (!isDeleteModalOpen) return;
                deleteAuditLog({ id: isDeleteModalOpen });
              }}
            >
              刪除
            </button>,
            <button
              key="closeModal"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={closeDeleteModal}
            >
              取消
            </button>,
          ]}
          onCloseModal={closeDeleteModal}
        >
          <div className="max-h-[60vh] min-w-48 text-lg leading-relaxed">
            <b>確定刪除?</b>
            <br />
            刪除後，無法恢復。
            <br />
            <br />
            請按「刪除」刪除表單。
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
