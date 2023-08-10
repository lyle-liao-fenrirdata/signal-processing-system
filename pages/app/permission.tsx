import React from "react";

import AdminLayout from "components/layouts/Admin";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ChartContainer } from "@/components/commons/ChartContainer";
import { trpc } from "@/utils/trpc";
import { PermissionTable } from "@/components/permission/Tables";
import { Role } from "@prisma/client";
import { Errors } from "@/components/commons/Errors";

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

export type UserInfo = {
  account: string;
  username: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export const formatDate = new Intl.DateTimeFormat("zh-TW", {
  hour12: false,
  dateStyle: "long",
  timeStyle: "medium",
});

export default function Settings({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, refetch } = trpc.permission.listall.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
  });

  const {
    mutate,
    isError,
    error: trpcError,
  } = trpc.permission.updateUserRole.useMutation({
    retry: false,
    onSuccess: () => {
      setUerInfo(null);
      refetch();
    },
  });

  const [userInfo, setUerInfo] = React.useState<UserInfo | null>(null);
  const [userUpdate, setUserUpdate] = React.useState<Omit<
    UserInfo,
    "createdAt" | "updatedAt" | "username"
  > | null>(null);

  function openUserModel(user: UserInfo) {
    setUerInfo(user);
    setUserUpdate(() => ({
      account: user.account,
      role: user.role,
      deletedAt: user.deletedAt,
    }));
  }

  function onSelected(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!userInfo) return;
    if (e.target.id === "role") {
      setUserUpdate((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          role: e.target.value as Role,
        };
      });
    } else if (e.target.id === "deletedAt") {
      setUserUpdate((prev) => {
        if (!prev) return null;

        return {
          ...prev,
          deletedAt: e.target.value === "inactive" ? new Date() : null,
        };
      });
    }
  }

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "權限設定", href: "/app/permission" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <div className="relative -ml-2 -mt-4 mb-8 rounded border-0 bg-indigo-600 px-4 py-3 text-white">
        <span className="mr-5 inline-block align-middle text-xl">
          <i className="fas fa-bell" />
        </span>
        <span className="mr-8 inline-block align-middle">
          <b>權限</b> 請參照下列權限說明
        </span>
      </div>
      <ChartContainer title={<>訪客 (Guest)</>}>
        <>
          <span className="block py-2 text-sm">
            GUEST - 僅具儀錶板與(個人)設定功能
          </span>
          <PermissionTable
            users={data?.guest || []}
            openModel={openUserModel}
          />
        </>
      </ChartContainer>
      <ChartContainer title={<>使用者 (User)</>}>
        <>
          <span className="block py-2 text-sm">
            USER - 除權限管理外，所有功能
          </span>
          <PermissionTable users={data?.user || []} openModel={openUserModel} />
        </>
      </ChartContainer>
      <ChartContainer title={<>管理者 (Admin)</>}>
        <>
          <span className="block py-2 text-sm">
            ADMIN -
            具有所有功能(如同你畫面所示，可查看所有使用者勾稽狀態、權限設定等)
          </span>
          <PermissionTable
            users={data?.admin || []}
            openModel={openUserModel}
          />
        </>
      </ChartContainer>
      <ChartContainer title={<>靜止帳戶 (Inactive)</>}>
        <>
          <span className="block py-2 text-sm text-red-600">
            刪除後，不會保留資料(包含所有該使用者的紀錄)，無法復原
          </span>
          <PermissionTable
            users={data?.deleted || []}
            openModel={openUserModel}
          />
        </>
      </ChartContainer>

      {/* user information model */}
      {userInfo && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden py-6 outline-none focus:outline-none">
            <div className="relative mx-auto w-auto">
              {/*content*/}
              <div className="relative rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 px-5 py-3">
                  <h3 className="text-lg font-semibold">使用者資訊</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-xl font-semibold leading-none text-black opacity-50 outline-none focus:outline-none"
                    onClick={() => setUerInfo(null)}
                  >
                    x
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto overflow-y-auto px-6 py-2">
                  <table className="w-full border-collapse items-center bg-transparent">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                          目前設定
                        </th>
                        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                          變更設定
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          姓名
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {userInfo.username}
                        </td>
                      </tr>
                      <tr>
                        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          帳號
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {userInfo.account}
                        </td>
                      </tr>
                      <tr>
                        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          狀態
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {Boolean(userInfo.deletedAt) ? "停用" : "啟用"}
                        </td>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          <select
                            name="deletedAt"
                            id="deletedAt"
                            className="rounded border-none py-0 text-xs focus:outline-none"
                            defaultValue={
                              Boolean(userInfo.deletedAt)
                                ? "inactive"
                                : "active"
                            }
                            onChange={onSelected}
                          >
                            <option value="active">啟用</option>
                            <option value="inactive">停用</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          註冊時間
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {formatDate.format(userInfo.createdAt)}
                        </td>
                      </tr>
                      <tr>
                        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          最後變更時間
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {formatDate.format(userInfo.updatedAt)}
                        </td>
                      </tr>
                      <tr>
                        <th className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          權限
                        </th>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {userInfo.role}
                        </td>
                        <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          <select
                            name="role"
                            id="role"
                            className="rounded border-none py-0 text-xs focus:outline-none"
                            defaultValue={userInfo.role}
                            onChange={onSelected}
                          >
                            <option value="GUEST">{Role.GUEST}</option>
                            <option value="USER">{Role.USER}</option>
                            <option value="ADMIN">{Role.ADMIN}</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <pre className="max-h-[60vh] text-sm leading-relaxed text-slate-500"></pre>
                  {isError && <Errors errors={[trpcError.message]} />}
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 px-6 py-3">
                  <button
                    className="mr-2 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={() => userUpdate && mutate(userUpdate)}
                  >
                    儲存變更
                  </button>
                  <button
                    className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                    type="button"
                    onClick={() => setUerInfo(null)}
                  >
                    關閉
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </AdminLayout>
  );
}
