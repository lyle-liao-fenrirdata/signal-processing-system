import React, { useEffect } from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "@/components/commons/Container";
import CardTable from "@/components/commons/TableContainer";
import Modal from "@/components/commons/Modal";
import { trpc } from "@/utils/trpc";
import { formatDate } from "@/utils/formats";
import { Color } from "@prisma/client";

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

const TableDropdown = () => (
  <a
    className="px-3 py-1 text-slate-500"
    href="#pablo"
    onClick={(e) => {
      e.preventDefault();
    }}
  >
    <i className="fas fa-ellipsis-v"></i>
  </a>
);

export default function Audit({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isAuditChangeModalOpen, setIsAuditChangeModalOpen] =
    React.useState(false);

  const { isError, isSuccess, data, isLoading, error } =
    trpc.audit.getLiveAudit.useQuery(undefined, {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: false,
    });

  // useEffect(() => {
  //   if (!isError && !isLoading && isSuccess) {
  //     console.log(JSON.stringify(data, undefined, 4));
  //   }
  // }, [data, isError, isLoading, isSuccess]);

  function closeAuditChangeModal() {
    setIsAuditChangeModalOpen(false);
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
      {isLoading ? (
        <CardTable
          color="light"
          title={<>表單紀錄</>}
          ths={[""]}
          tbodyTrs={[
            {
              th: "Loading...",
              tds: [],
            },
          ]}
        />
      ) : isError ? (
        <CardTable
          color="light"
          title={<>表單紀錄</>}
          ths={["", ""]}
          tbodyTrs={[
            {
              th: "Error",
              tds: [<>錯誤</>, <>{error?.message}</>],
            },
          ]}
        />
      ) : (
        <Container
          title={
            <div className="flex justify-between text-center">
              <h6 className="text-xl font-bold text-slate-700">勾稽表單</h6>
              <div>
                <button
                  className="mr-4 rounded border border-slate-700 px-4 py-2 text-xs font-bold shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none"
                  type="button"
                  onClick={() => {}}
                >
                  提交紀錄
                </button>
                <button
                  className="rounded bg-slate-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={() => {}}
                >
                  新增紀錄
                </button>
              </div>
            </div>
          }
        >
          <div className="grid grid-cols-12 gap-4">
            {data.map((audit) => (
              <React.Fragment key={`audit-${audit.id}`}>
                <span className="col-span-12 mt-2 block w-full rounded p-2.5 text-base">
                  <span className="mb-2 block font-semibold text-gray-900">
                    上機概要
                  </span>
                  <span className="block"></span>
                  {audit.comment ?? "無"}
                </span>
                <hr className="col-span-12 border-slate-300" />
                {audit.auditGroups.map((auditGroup) => (
                  <React.Fragment key={`auditGroup-${auditGroup.id}`}>
                    <div
                      className={`col-span-3 flex items-center justify-center rounded ${
                        auditGroup.color === Color.Blue
                          ? "bg-sky-50"
                          : auditGroup.color === Color.Gray
                          ? "bg-neutral-50"
                          : auditGroup.color === Color.Green
                          ? "bg-green-50"
                          : auditGroup.color === Color.Orange
                          ? "bg-orange-50"
                          : auditGroup.color === Color.Pink
                          ? "bg-pink-50"
                          : auditGroup.color === Color.Purple
                          ? "bg-purple-50"
                          : auditGroup.color === Color.Red
                          ? "bg-red-50"
                          : auditGroup.color === Color.Yellow
                          ? "bg-yellow-50"
                          : "bg-slate-50"
                      }`}
                    >
                      <span className="inline-block px-3 py-1 text-base font-semibold">
                        {auditGroup.name}
                      </span>
                    </div>
                    <div className="col-span-5 flex flex-col justify-center gap-2">
                      {auditGroup.auditItems.map((auditItem) => (
                        <div
                          key={`auditItem-${auditItem.id}`}
                          className="items-top relative flex flex-nowrap items-center space-x-2"
                        >
                          <input
                            id={`auditItem-input-${auditItem.id}`}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
                            defaultChecked={false}
                          />
                          <label
                            htmlFor={`auditItem-input-${auditItem.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {auditItem.name}
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
            ))}
          </div>
        </Container>
      )}
      {/* {isAuditChangeModalOpen && (
        <Modal
          header="新增(變更)表單"
          actions={[
            <button
              key={`save audit change`}
              className="mr-2 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() => {}}
            >
              儲存變更
            </button>,
            <button
              key="closeModal"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={closeAuditChangeModal}
            >
              關閉
            </button>,
          ]}
          onCloseModal={closeAuditChangeModal}
        >
          <div className="max-h-[60vh] min-w-48 text-lg leading-relaxed">
            <b>確定要刪除此帳號?</b>
            <br />
            此動作無法復原，會一併刪除任何稽核紀錄。
            <br />
            <br />
            請按「確認刪除」刪除此帳號。
          </div>
        </Modal>
      )} */}
    </AdminLayout>
  );
}
