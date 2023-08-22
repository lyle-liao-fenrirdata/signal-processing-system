import React, { useEffect } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "@/components/commons/Container";
import Modal from "@/components/commons/Modal";
import { trpc } from "@/utils/trpc";
import { Color } from "@prisma/client";
import { Errors } from "@/components/commons/Errors";
import {
  AuditDescriptionInput,
  AuditIsCheckedSchemaInput,
} from "@/server/schema/audit.schema";

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
  const [isAuditSubmitModalOpen, setIsAuditSubmitModalOpen] =
    React.useState(false);
  const [activeLog, setActiveLog] = React.useState<
    | (AuditDescriptionInput & {
        groups: (AuditDescriptionInput & {
          color: string;
          name: string;
          items: (AuditIsCheckedSchemaInput & { name: string })[];
        })[];
      })
    | null
  >(null);

  const {
    isError: isUserAuditLogError,
    isSuccess: isUserAuditLogSuccess,
    data: userAuditLog,
    isLoading: isUserAuditLogLoading,
    error: userAuditLogError,
    refetch: refetchUserAuditLog,
  } = trpc.audit.getUserAuditLog.useQuery(undefined, {
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
  } = trpc.audit.createNewAuditLog.useMutation({
    retry: false,
  });

  // useEffect(() => {
  //   if (
  //     !isCreateNewAuditError &&
  //     !isCreateNewAuditLoading &&
  //     isCreateNewAuditSuccess
  //   ) {
  //     refetchUserAuditLog();
  //   }
  // }, [
  //   isCreateNewAuditError,
  //   isCreateNewAuditLoading,
  //   isCreateNewAuditSuccess,
  //   refetchUserAuditLog,
  // ]);

  useEffect(() => {
    if (
      !isUserAuditLogError &&
      !isUserAuditLogLoading &&
      isUserAuditLogSuccess &&
      userAuditLog.length
    ) {
      const log = userAuditLog.find((log) => !log.isLocked);
      if (log) {
        setActiveLog({
          id: log.id,
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

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "稽核勾稽", href: "/app/audit" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      {/* <Container title={<>勾稽表單</>}>
        <>勾稽表單</>
      </Container> */}
      {/* <CardTable
        color="light"
        title={<>勾稽紀錄</>}
        ths={["Project", "Budget", "Status", "Completion", "Action"]}
        tbodyTrs={[
          {
            th: "Argon Design System",
            tds: [
              <>$2,500 USD</>,
              <>
                <i className="fas fa-circle mr-2 text-orange-500"></i> pending
              </>,
              <>
                <div className="flex items-center">
                  <span className="mr-2">60%</span>
                  <div className="relative w-full">
                    <div className="flex h-2 overflow-hidden rounded bg-red-200 text-xs">
                      <div
                        style={{ width: "60%" }}
                        className="flex flex-col justify-center whitespace-nowrap bg-red-500 text-center text-white shadow-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </>,
              <>
                <TableDropdown />
              </>,
            ],
          },
        ]}
      /> */}
      <Container
        title={
          <div className="flex justify-between text-center">
            <h6 className="text-xl font-bold text-slate-700">勾稽表單</h6>
            <div>
              <button
                className="mr-4 rounded border border-slate-700 px-4 py-2 text-xs font-bold shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none"
                type="button"
                onClick={() => {
                  setIsAuditSubmitModalOpen(() => true);
                }}
              >
                提交紀錄
              </button>
              <button
                className="rounded bg-slate-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600 disabled:opacity-50"
                type="button"
                onClick={() => {
                  createNewAudit();
                }}
                disabled={
                  isCreateNewAuditLoading ||
                  (userAuditLog && userAuditLog.some((al) => !al.isLocked))
                }
              >
                新增紀錄
              </button>
              {isCreateNewAuditError && (
                <Errors errors={[createNewAuditError.message]} />
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
            <React.Fragment key={`auditLog-${activeLog.id}`}>
              <span className="col-span-12 mt-2 block w-full rounded p-2.5 text-base">
                <span className="mb-2 block font-semibold text-gray-900">
                  上機概要
                </span>
                <span className="block"></span>
                {activeLog.description ?? "無"}
              </span>
              <hr className="col-span-12 border-slate-300" />
              {activeLog.groups.map((group) => (
                <React.Fragment key={`auditGroupLog-${group.id}`}>
                  <div
                    className={`col-span-3 flex items-center justify-center rounded ${
                      group.color === Color.Blue
                        ? "bg-sky-50"
                        : group.color === Color.Gray
                        ? "bg-neutral-50"
                        : group.color === Color.Green
                        ? "bg-green-50"
                        : group.color === Color.Orange
                        ? "bg-orange-50"
                        : group.color === Color.Pink
                        ? "bg-pink-50"
                        : group.color === Color.Purple
                        ? "bg-purple-50"
                        : group.color === Color.Red
                        ? "bg-red-50"
                        : group.color === Color.Yellow
                        ? "bg-yellow-50"
                        : "bg-slate-50"
                    }`}
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
                          defaultChecked={false}
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
                ></textarea>
              </div>
              <hr className="col-span-12 border-slate-300" />
              <div className="col-span-12 flex flex-row justify-end gap-4">
                <button
                  className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none"
                  type="button"
                  onClick={() => {}}
                >
                  儲存變更
                </button>
              </div>
            </React.Fragment>
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
              onClick={() => {}}
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
