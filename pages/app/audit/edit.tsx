import React, { Fragment, useCallback, useEffect } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "@/components/commons/Container";
import Modal from "@/components/commons/Modal";
import { trpc } from "@/utils/trpc";
import { Color } from "@prisma/client";
import { Errors } from "@/components/commons/Errors";
import debounce from "lodash.debounce";
import Link from "next/link";
import DropTableContainer from "@/components/commons/DropTableContainer";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/formats";
import {
  AuditGroupInput,
  AuditGroupItemCommonInput,
} from "@/server/schema/audit.schema";

export type ActiveAudit = {
  id: number;
  comment: string;
  groups: (AuditGroupInput & {
    items: AuditGroupItemCommonInput[];
  })[];
};

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

export default function Edit({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { query, push, pathname } = useRouter();
  const queryHistoryLog = getParamValue("id");

  function getParamValue(name: string) {
    const value = query[name];
    return !value
      ? value
      : Array.isArray(value)
      ? value.map((el) => decodeURIComponent(el))
      : decodeURIComponent(value);
  }

  function isCurrentLog(id: string | number) {
    return Array.isArray(queryHistoryLog)
      ? queryHistoryLog.some((q) => q === String(id))
      : queryHistoryLog === String(id);
  }

  function onHistoryLogClick(id: number, pathname: string) {
    if (!window) return;
    if (isCurrentLog(id)) return push(new URL(pathname, window.location.href));

    const url = new URL(pathname + `#history-${id}`, window.location.href);
    url.searchParams.append("id", String(id));
    push(url);
  }

  const [isSync, setIsSync] = React.useState<boolean>(true);
  const [isActivateModalOpen, setIsActivateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [activeLog, setActiveLog] = React.useState<ActiveAudit | null>(null);

  const {
    isError: isAuditError,
    isSuccess: isAuditSuccess,
    data: audit,
    isLoading: isAuditLoading,
    error: auditError,
    refetch: refetchAudit,
  } = trpc.audit.getAllAudit.useQuery(undefined, {
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const {
    mutate: createNewAudit,
    isError: isCreateNewAuditError,
    isLoading: isCreateNewAuditLoading,
    isSuccess: isCreateNewAuditSuccess,
    error: createNewAuditError,
  } = trpc.audit.createNewAudit.useMutation({
    retry: false,
    onSuccess: () => {
      refetchAudit();
    },
  });

  const {
    mutate: deleteAudit,
    isError: isDeleteAudutError,
    isLoading: isDeleteAudutLoading,
    isSuccess: isDeleteAudutSuccess,
    error: deleteAudutError,
  } = trpc.audit.deleteAudit.useMutation({
    retry: false,
    onSuccess: () => {
      refetchAudit();
      setIsDeleteModalOpen(false);
    },
  });

  const {
    mutate: activateAudit,
    isError: isActivateAuditError,
    isLoading: isActivateAuditLoading,
    isSuccess: isActivateAuditSuccess,
    error: activateAuditError,
  } = trpc.audit.activateAudit.useMutation({
    retry: false,
    onSuccess: () => {
      refetchAudit();
      setIsActivateModalOpen(false);
    },
  });

  const {
    mutate: saveAudit,
    isError: isSaveAuditError,
    isLoading: isSaveAuditLoading,
    isSuccess: isSaveAuditSuccess,
    error: saveAuditError,
  } = trpc.audit.saveAudit.useMutation({
    retry: false,
    onSuccess: () => debouncedRefetchUserAuditLog(),
  });

  const {
    mutate: saveAuditGroup,
    isError: isSaveAuditGroupError,
    isLoading: isSaveAuditGroupLoading,
    isSuccess: isSaveAuditGroupSuccess,
    error: saveAuditGroupError,
  } = trpc.audit.saveAuditGroup.useMutation({
    retry: false,
    onSuccess: () => debouncedRefetchUserAuditLog(),
  });

  const {
    mutate: saveAuditItem,
    isError: isSaveAuditItemError,
    isLoading: isSaveAuditItemLoading,
    isSuccess: isSaveAuditItemSuccess,
    error: saveAuditItemError,
  } = trpc.audit.saveAuditItem.useMutation({
    retry: false,
    onSuccess: () => debouncedRefetchUserAuditLog(),
  });

  useEffect(() => {
    if (!isAuditError && !isAuditLoading && isAuditSuccess && audit.length) {
      const log = audit[0];
      if (!log.isActive) {
        setActiveLog({
          id: log.id,
          comment: log.comment ?? "",
          groups: log.auditGroups.map(
            ({ id, order, color, name, auditItems }) => ({
              id,
              color,
              order,
              name,
              items: auditItems.map(({ id, name, order }) => ({
                id,
                name,
                order,
              })),
            })
          ),
        });
        setIsSync(() => true);
      } else {
        setActiveLog(null);
      }
    }
  }, [isAuditError, isAuditLoading, isAuditSuccess, audit, username]);

  function closeActivateSubmitModal() {
    setIsActivateModalOpen(false);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
  }

  function onCommentChange(comment: string) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comment,
      };
    });
  }

  function onGroupInputChange(name: string, groupId: number) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              name,
            };
          }
          return g;
        }),
      };
    });
  }

  function onGroupSelectChange(color: Color, groupId: number) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              color,
            };
          }
          return g;
        }),
      };
    });
  }

  function onItemInputChange(name: string, itemId: number) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.items.some((item) => item.id === itemId)) {
            return {
              ...group,
              items: group.items.map((item) => {
                if (item.id !== itemId) return item;
                return {
                  ...item,
                  name,
                };
              }),
            };
          }
          return group;
        }),
      };
    });
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSyncInput = useCallback(debounce(syncInput, 2000), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedRefetchUserAuditLog = useCallback(
    debounce(refetchAudit, 1000),
    []
  );

  function syncInput(auditLog: typeof audit, active: typeof activeLog) {
    const log =
      active && auditLog && auditLog.find((log) => active.id === log.id);
    if (!log || !active) return;
    if (log.comment !== active.comment) {
      saveAudit({ id: active.id, comment: active.comment });
    }
    log.auditGroups.map((group) => {
      const currGroup = active.groups.find((ag) => ag.id === group.id);
      if (!currGroup) return;
      if (
        group.name !== currGroup.name ||
        group.color !== currGroup.color ||
        group.order !== currGroup.order
      ) {
        saveAuditGroup({
          id: currGroup.id,
          name: currGroup.name,
          color: currGroup.color,
          order: currGroup.order,
        });
      }
      group.auditItems.map((item) => {
        const currItem = currGroup.items.find((i) => i.id === item.id);
        if (!currItem) return;
        if (item.name !== currItem.name || item.order !== currItem.order) {
          console.log(item.name, currItem.name, item.order, currItem.order);
          saveAuditItem({
            id: currItem.id,
            name: currItem.name,
            order: currItem.order,
          });
        }
      });
    });
  }

  useEffect(() => {
    debouncedSyncInput(audit, activeLog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLog]);

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [
          { title: "稽核勾稽", href: "/app/audit" },
          { title: "編輯表單", href: "/app/audit/edit" },
        ],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <Container
        title={
          <div className="flex items-center justify-between">
            <h6 className="font-bold text-slate-700">編輯表單</h6>
            <div className="flex flex-row items-center gap-4 text-xs">
              {!activeLog ? (
                <button
                  className="rounded border border-slate-700 px-4 py-2 text-xs font-bold shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none disabled:opacity-50"
                  type="button"
                  onClick={() => {
                    debounce(createNewAudit, 500)();
                  }}
                >
                  新建
                </button>
              ) : (
                <>
                  {isSync ? (
                    <span className="text-emerald-700">已儲存✅</span>
                  ) : (
                    <span className="text-red-600">同步中...</span>
                  )}
                  <button
                    className="rounded border border-slate-700 px-4 py-2 text-xs font-bold shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none disabled:opacity-50"
                    type="button"
                    onClick={() => {
                      setIsActivateModalOpen(() => true);
                    }}
                    disabled={isActivateAuditLoading}
                  >
                    啟用
                  </button>
                  <button
                    className="rounded bg-red-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-red-600 disabled:opacity-50"
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(() => true);
                    }}
                    disabled={isDeleteAudutLoading}
                  >
                    刪除
                  </button>
                </>
              )}
              {/* {isCreateNewAuditLogError && (
                <Errors errors={[createNewAuditLogError.message]} />
              )} */}
            </div>
          </div>
        }
      >
        {isAuditLoading ? (
          <span>Fetching... Loading...</span>
        ) : isAuditError ? (
          <Errors errors={[auditError?.message]} />
        ) : !activeLog ? (
          <span>無在編輯表單</span>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-12 block w-full rounded pt-2.5">
              <span className="mb-2 block px-1.5 font-semibold text-gray-900">
                上機概要
              </span>
              <textarea
                id="comment"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Write your results or findings here..."
                value={activeLog.comment}
                onChange={(e) => {
                  onCommentChange(e.target.value);
                }}
              ></textarea>
            </span>
            <hr className="col-span-12 border-slate-300" />
            {activeLog.groups.map((group) => (
              <React.Fragment key={`auditGroup-${group.id}`}>
                <div
                  className={`col-span-5 flex items-center gap-2.5 rounded p-2.5 ${
                    group.color === Color.Blue
                      ? "bg-sky-200"
                      : group.color === Color.Gray
                      ? "bg-neutral-200"
                      : group.color === Color.Green
                      ? "bg-green-200"
                      : group.color === Color.Orange
                      ? "bg-orange-200"
                      : group.color === Color.Pink
                      ? "bg-pink-200"
                      : group.color === Color.Purple
                      ? "bg-purple-200"
                      : group.color === Color.Red
                      ? "bg-red-200"
                      : group.color === Color.Yellow
                      ? "bg-yellow-200"
                      : "bg-slate-200"
                  }`}
                >
                  <input
                    id={`auditAudit-input-${group.id}`}
                    type="text"
                    className="grow rounded border-gray-300 bg-white text-sm focus:ring-blue-500"
                    value={group.name}
                    onChange={(e) => {
                      onGroupInputChange(e.target.value, group.id);
                    }}
                  />

                  <select
                    name="arkimeAvailavbleSelections"
                    id="arkimeAvailavbleSelections"
                    value={group.color}
                    className="shrink-0 rounded border-gray-300 bg-white px-3 pl-2 pr-8 text-sm outline-none focus:border-transparent focus:outline-none active:outline-none"
                    onChange={(e) => {
                      onGroupSelectChange(e.target.value as Color, group.id);
                    }}
                  >
                    {Object.values(Color).map((c) => (
                      <option
                        value={c}
                        key={`auditGroup-${group.id}-color-option-${c}`}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-7 flex flex-col justify-center gap-2">
                  {group.items.map((item) => (
                    <div
                      key={`auditItemLog-${item.id}`}
                      className="items-top relative flex flex-nowrap items-center space-x-2"
                    >
                      <input
                        id={`auditItem-input-${item.id}`}
                        type="text"
                        className="grow rounded border-gray-300 bg-white text-sm focus:ring-blue-500"
                        value={item.name}
                        onChange={(e) => {
                          onItemInputChange(e.target.value, item.id);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
            <hr className="col-span-12 border-slate-300" />
          </div>
        )}
      </Container>

      {isActivateModalOpen && (
        <Modal
          header="啟用表單"
          actions={[
            <button
              key={`save audit change`}
              className="mr-2 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() =>
                debounce(() => {
                  if (!activeLog) return;
                  activateAudit({
                    id: activeLog.id,
                  });
                }, 500)()
              }
            >
              啟用
            </button>,
            <button
              key="closeModal"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={closeActivateSubmitModal}
            >
              取消
            </button>,
          ]}
          onCloseModal={closeActivateSubmitModal}
        >
          <div className="max-h-[60vh] min-w-48 text-lg leading-relaxed">
            <b>確定啟用?</b>
            <br />
            啟用後，使用者在下次 &#34;新增紀錄&#34; 時，才會套用新表單。
            <br />
            <br />
            請按「啟用」啟用表單。
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          header="刪除表單"
          actions={[
            <button
              key={`save audit change`}
              className="mr-2 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() =>
                debounce(() => {
                  if (!activeLog) return;
                  deleteAudit({ id: activeLog.id });
                }, 500)()
              }
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

      <DropTableContainer
        title={<>歷史表單</>}
        ths={["Record ID", "建立時間", "狀態", "建立者"]}
        tbodyTrs={
          !audit
            ? []
            : audit.map((log) => ({
                key: `history-${log.id}`,
                onClick: () => onHistoryLogClick(log.id, pathname),
                content:
                  queryHistoryLog && isCurrentLog(log.id) ? (
                    <div className="grid grid-cols-12 gap-4 rounded bg-slate-100 p-6">
                      <span className="col-span-12 block w-full rounded">
                        <span className="block text-sm font-semibold text-gray-900">
                          上機概要
                        </span>
                        <span className="block text-xs">
                          {log.comment ?? "無"}
                        </span>
                      </span>
                      {log.auditGroups.map((group) => (
                        <Fragment key={`histroy-auditGroupLog-${group.id}`}>
                          <div
                            className={`col-span-5 flex items-center justify-center rounded ${
                              group.color === Color.Blue
                                ? "bg-sky-200"
                                : group.color === Color.Gray
                                ? "bg-neutral-200"
                                : group.color === Color.Green
                                ? "bg-green-200"
                                : group.color === Color.Orange
                                ? "bg-orange-200"
                                : group.color === Color.Pink
                                ? "bg-pink-200"
                                : group.color === Color.Purple
                                ? "bg-purple-200"
                                : group.color === Color.Red
                                ? "bg-red-200"
                                : group.color === Color.Yellow
                                ? "bg-yellow-200"
                                : "bg-slate-200"
                            }`}
                          >
                            <span className="inline-block px-3 py-1 text-sm font-semibold">
                              {group.name}
                            </span>
                          </div>
                          <div className="col-span-7 flex flex-col justify-center gap-2">
                            {group.auditItems.map((item) => (
                              <div
                                key={`history-auditItemLog-${item.id}`}
                                className="items-top relative flex flex-nowrap items-center space-x-2"
                              >
                                <label
                                  htmlFor={`auditItemLog-input-${item.id}`}
                                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  ) : undefined,
                tds: [
                  String(log.id),
                  formatDate.format(log.createdAt),
                  log.isActive ? "✔️ 在用" : "❌ 停用",
                  log.createdBy.username,
                ],
              }))
        }
      />
    </AdminLayout>
  );
}
