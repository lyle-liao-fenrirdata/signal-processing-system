import React, { useCallback, useEffect } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "@/components/commons/Container";
import Modal from "@/components/commons/Modal";
import { trpc } from "@/utils/trpc";
import { Color, Role } from "@prisma/client";
import { Errors } from "@/components/commons/Errors";
import {
  AuditDescriptionInput,
  AuditIsCheckedInput,
} from "@/server/schema/audit.schema";
import debounce from "lodash.debounce";
import Link from "next/link";

export type ActiveLog = AuditDescriptionInput & {
  comment: string;
  groups: (AuditDescriptionInput & {
    color: Color;
    name: string;
    items: (AuditIsCheckedInput & { name: string })[];
  })[];
};

export const getAuditGroupBgColor = (color: Color) => {
  return color === Color.Blue
    ? "bg-sky-200"
    : color === Color.Gray
    ? "bg-neutral-200"
    : color === Color.Green
    ? "bg-green-200"
    : color === Color.Orange
    ? "bg-orange-200"
    : color === Color.Pink
    ? "bg-pink-200"
    : color === Color.Purple
    ? "bg-purple-200"
    : color === Color.Red
    ? "bg-red-200"
    : color === Color.Yellow
    ? "bg-yellow-200"
    : "bg-slate-200";
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

export default function Audit({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSync, setIsSync] = React.useState<boolean>(true);
  const [isAuditSubmitModalOpen, setIsAuditSubmitModalOpen] =
    React.useState(false);
  const [activeLog, setActiveLog] = React.useState<ActiveLog | null>(null);

  const {
    isError: isUserAuditLogError,
    isSuccess: isUserAuditLogSuccess,
    data: userAuditLog,
    isLoading: isUserAuditLogLoading,
    error: userAuditLogError,
    refetch: refetchUserAuditLog,
  } = trpc.audit.getUserActiveAuditLog.useQuery(undefined, {
    retry: false,
    retryOnMount: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const {
    mutate: createNewAuditLog,
    isError: isCreateNewAuditLogError,
    isLoading: isCreateNewAuditLogLoading,
    isSuccess: isCreateNewAuditLogSuccess,
    error: createNewAuditLogError,
  } = trpc.audit.createNewAuditLog.useMutation({
    retry: false,
    onSuccess: () => {
      refetchUserAuditLog();
    },
  });

  const {
    mutate: lockAuditLog,
    isError: isLockAudutLogError,
    isLoading: isLockAudutLogLoading,
    isSuccess: isLockAudutLogSuccess,
    error: lockAuditLogError,
  } = trpc.audit.lockAuditLog.useMutation({
    retry: false,
    onSuccess: () => {
      refetchUserAuditLog();
      setIsAuditSubmitModalOpen(false);
    },
  });

  const {
    mutate: saveAuditLog,
    isError: isSaveAuditLogError,
    isLoading: isSaveAuditLogLoading,
    isSuccess: isSaveAuditLogSuccess,
    error: saveAuditLogError,
  } = trpc.audit.saveAuditLog.useMutation({
    retry: false,
    onSuccess: () => debouncedRefetchUserAuditLog(),
  });

  const {
    mutate: saveAuditGroupLog,
    isError: isSaveAuditGroupLogError,
    isLoading: isSaveAuditGroupLogLoading,
    isSuccess: isSaveAuditGroupLogSuccess,
    error: saveAuditGroupLogError,
  } = trpc.audit.saveAuditGroupLog.useMutation({
    retry: false,
    onSuccess: () => debouncedRefetchUserAuditLog(),
  });

  const {
    mutate: saveAuditItemLog,
    isError: isSaveAuditItemLogError,
    isLoading: isSaveAuditItemLogLoading,
    isSuccess: isSaveAuditItemLogSuccess,
    error: saveAuditItemLogError,
  } = trpc.audit.saveAuditItemLog.useMutation({
    retry: false,
    onSuccess: () => debouncedRefetchUserAuditLog(),
  });

  useEffect(() => {
    if (
      !isUserAuditLogError &&
      !isUserAuditLogLoading &&
      isUserAuditLogSuccess &&
      userAuditLog
    ) {
      const log = userAuditLog.find((log) => !log.isLocked);
      if (log) {
        setActiveLog({
          id: log.id,
          comment: log.audit.comment ?? "",
          description: log.description ?? "",
          groups: log.auditGroupLogs.map((groupLog) => ({
            id: groupLog.id,
            description: groupLog.description ?? "",
            color: groupLog.auditGroup.color,
            name: groupLog.auditGroup.name,
            items: groupLog.auditItemLogs.map((itemLog) => ({
              id: itemLog.id,
              isChecked: itemLog.isChecked,
              name: itemLog.auditItem.name,
            })),
          })),
        });
        setIsSync(() => true);
      } else {
        setActiveLog(null);
      }
    }
  }, [
    isUserAuditLogError,
    isUserAuditLogLoading,
    isUserAuditLogSuccess,
    userAuditLog,
  ]);

  function closeAuditSubmitModal() {
    setIsAuditSubmitModalOpen(false);
  }

  function onCheckboxChange(isChecked: boolean, itemId: string) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.reduce((prevGroup, currGroup) => {
          if (currGroup.items.some((item) => item.id === itemId)) {
            return [
              ...prevGroup,
              {
                ...currGroup,
                items: currGroup.items.reduce((prevItem, currItem) => {
                  if (currItem.id === itemId) {
                    return [
                      ...prevItem,
                      {
                        ...currItem,
                        isChecked,
                      },
                    ];
                  }
                  return [...prevItem, currItem];
                }, [] as typeof currGroup.items),
              },
            ];
          }
          return [...prevGroup, currGroup];
        }, [] as typeof prev.groups),
      };
    });
  }

  function onGroupTextboxChange(description: string, groupId: string) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        groups: prev.groups.reduce((prevGroup, currGroup) => {
          if (currGroup.id === groupId) {
            return [
              ...prevGroup,
              {
                ...currGroup,
                description,
              },
            ];
          }
          return [...prevGroup, currGroup];
        }, [] as typeof prev.groups),
      };
    });
  }

  function onLogTextboxChange(description: string) {
    setIsSync(false);
    setActiveLog((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        description,
      };
    });
  }

  function lockLog() {
    if (activeLog)
      lockAuditLog({
        id: activeLog.id,
        isLocked: true,
      });
  }

  const syncInput = useCallback(
    (auditLog: typeof userAuditLog, active: typeof activeLog) => {
      let isUpdateFlag = false;
      const log = auditLog && auditLog.find((log) => !log.isLocked);
      if (!log || !active) return;
      if (log.description !== active.description) {
        saveAuditLog({ id: active.id, description: active.description });
        isUpdateFlag = true;
      }
      log.auditGroupLogs.map((groupLog) => {
        const currGroupLog = active.groups.find((ag) => ag.id === groupLog.id);
        if (!currGroupLog) return;
        if (groupLog.description !== currGroupLog.description) {
          saveAuditGroupLog({
            id: currGroupLog.id,
            description: currGroupLog.description,
          });
          isUpdateFlag = true;
        }
        groupLog.auditItemLogs.map((itemLog) => {
          const currItem = currGroupLog.items.find(
            (item) => item.id === itemLog.id
          );
          if (!currItem) return;
          if (itemLog.isChecked !== currItem.isChecked) {
            saveAuditItemLog({
              id: currItem.id,
              isChecked: currItem.isChecked,
            });
            isUpdateFlag = true;
          }
        });
      });
      if (!isUpdateFlag) setIsSync(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    debouncedSyncInput(userAuditLog, activeLog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLog]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSyncInput = useCallback(debounce(syncInput, 2000), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedRefetchUserAuditLog = useCallback(
    debounce(refetchUserAuditLog, 300),
    []
  );

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "稽核勾稽", href: "/app/audit" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <Container
        title={
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <h6 className="font-bold text-slate-700">勾稽表單</h6>
              {role === Role.ADMIN && (
                <>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a
                    href="/app/audit/edit"
                    className="text-xs text-slate-400 hover:underline"
                  >
                    編輯
                  </a>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a
                    href="/app/audit/report"
                    className="text-xs text-slate-400 hover:underline"
                  >
                    報表
                  </a>
                </>
              )}
            </div>
            <div className="flex flex-row items-center gap-4 text-xs">
              {activeLog ? (
                <>
                  {isSync ? (
                    <span className="text-emerald-700">已儲存✅</span>
                  ) : (
                    <span className="text-red-600">同步中...</span>
                  )}
                  <button
                    className="rounded border border-slate-700 px-4 py-2 text-xs font-bold shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none disabled:opacity-50"
                    type="button"
                    disabled={
                      isLockAudutLogLoading ||
                      isSaveAuditLogLoading ||
                      isSaveAuditGroupLogLoading ||
                      isSaveAuditItemLogLoading
                    }
                    onClick={() => {
                      setIsAuditSubmitModalOpen(() => true);
                    }}
                  >
                    提交紀錄
                  </button>
                </>
              ) : (
                <button
                  className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600 disabled:opacity-50"
                  type="button"
                  onClick={() => {
                    createNewAuditLog();
                  }}
                  disabled={isCreateNewAuditLogLoading}
                >
                  新增紀錄
                </button>
              )}
              <Link
                href="/app/audit/histroy"
                className="text-xs text-slate-400 hover:underline"
              >
                歷史紀錄
              </Link>
              {isCreateNewAuditLogError && (
                <Errors errors={[createNewAuditLogError.message]} />
              )}
            </div>
          </div>
        }
      >
        {isUserAuditLogLoading ? (
          <span>Fetching... Loading...</span>
        ) : isUserAuditLogError ? (
          <Errors errors={[userAuditLogError?.message]} />
        ) : !activeLog ? (
          <span>無在用紀錄</span>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <span className="col-span-12 block w-full rounded p-2.5">
              <span className="mb-2 block font-semibold text-gray-900">
                上機概要
              </span>
              <span className="block whitespace-pre-line text-sm">
                {activeLog.comment ?? "無"}
              </span>
            </span>
            <hr className="col-span-12 border-slate-300" />
            {activeLog.groups.map((group) => (
              <React.Fragment key={`auditGroupLog-${group.id}`}>
                <div
                  className={`col-span-3 flex items-center justify-center rounded ${getAuditGroupBgColor(
                    group.color
                  )}`}
                >
                  <span className="inline-block px-3 py-1 text-base font-semibold">
                    {group.name}
                  </span>
                </div>
                <div className="col-span-5 flex flex-col justify-center gap-2">
                  {group.items.map((item) => (
                    <div
                      key={`auditItemLog-${item.id}`}
                      className="items-top relative flex flex-nowrap items-center space-x-2"
                    >
                      <input
                        id={`auditItemLog-input-${item.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
                        checked={item.isChecked}
                        onChange={(e) => {
                          onCheckboxChange(e.target.checked, item.id);
                        }}
                      />
                      <label
                        htmlFor={`auditItemLog-input-${item.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="col-span-4">
                  <textarea
                    id="message"
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Write your results or findings here..."
                    value={group.description}
                    onChange={(e) => {
                      onGroupTextboxChange(e.target.value, group.id);
                    }}
                  ></textarea>
                </div>
              </React.Fragment>
            ))}
            <div className="col-span-12">
              <textarea
                id="message"
                rows={4}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Write your results or findings here..."
                value={activeLog.description}
                onChange={(e) => {
                  onLogTextboxChange(e.target.value);
                }}
              ></textarea>
            </div>
            <hr className="col-span-12 border-slate-300" />
          </div>
        )}
      </Container>
      {isAuditSubmitModalOpen && (
        <Modal
          header="提交表單"
          actions={[
            <button
              key={`save audit change`}
              className="mr-2 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() => debounce(lockLog, 500)()}
            >
              提交
            </button>,
            <button
              key="closeModal"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={closeAuditSubmitModal}
            >
              取消
            </button>,
          ]}
          onCloseModal={closeAuditSubmitModal}
        >
          <div className="max-h-[60vh] min-w-48 text-lg leading-relaxed">
            <b>確定提交?</b>
            <br />
            提交後，無法更改。
            <br />
            <br />
            請按「提交」送出紀錄。
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
