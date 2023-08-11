import React from "react";

import AdminLayout from "components/layouts/Admin";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ChartContainer } from "@/components/commons/ChartContainer";
import { trpc } from "@/utils/trpc";
import { PermissionTable } from "@/components/permission/Tables";
import { Role } from "@prisma/client";
import { Errors } from "@/components/commons/Errors";
import ModalExt from "@/components/permission/ModalExt";
import Modal from "@/components/commons/Modal";
import {
  ResetUserPasswordInput,
  resetUserPasswordSchema,
} from "@/server/schema/permission.schema";

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

export default function Permission({
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
    mutate: updateUser,
    isError: isUpdateError,
    error: updateError,
  } = trpc.permission.updateUserRole.useMutation({
    retry: false,
    onSuccess: () => {
      closeUpdateModel();
      refetch();
    },
  });

  const {
    mutate: removeUser,
    // isError: isRemoveError,
    // error: removeError,
  } = trpc.permission.removeUser.useMutation({
    retry: false,
    onSuccess: () => {
      setIsRemoveComfirmModelOpen(false);
      closeUpdateModel();
      refetch();
    },
  });

  const {
    mutate: resetUser,
    isLoading,
    isError,
    error: trpcError,
  } = trpc.permission.resetPassword.useMutation({
    retry: false,
    onSuccess: () => {
      setIsResetPasswordModelOpen(false);
      closeUpdateModel();
      refetch();
    },
  });

  const [userInfo, setUerInfo] = React.useState<UserInfo | null>(null);
  const [userUpdate, setUserUpdate] = React.useState<Omit<
    UserInfo,
    "createdAt" | "updatedAt" | "username"
  > | null>(null);
  const [isRemoveComfirmModelOpen, setIsRemoveComfirmModelOpen] =
    React.useState(false);
  const [isResetPasswordModelOpen, setIsResetPasswordModelOpen] =
    React.useState(false);
  const [error, setError] = React.useState<{
    account: string[];
    password: string[];
    passwordConfirm: string[];
  }>({ account: [], password: [], passwordConfirm: [] });
  const [registerInfo, setRegisterInfo] =
    React.useState<ResetUserPasswordInput>({
      account: "",
      password: "",
      passwordConfirm: "",
    });

  function openUpdateModel(user: UserInfo) {
    setUerInfo(user);
    setUserUpdate(() => ({
      account: user.account,
      role: user.role,
      deletedAt: user.deletedAt,
    }));
  }

  function closeUpdateModel() {
    setUerInfo(null);
    setUserUpdate(() => null);
  }

  function openResetModel(user: UserInfo) {
    setRegisterInfo((prev) => ({ ...prev, account: user.account }));
    setIsResetPasswordModelOpen(true);
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

  function onSubmit() {
    if (isLoading) return;

    const result = resetUserPasswordSchema.safeParse(registerInfo);
    const errors = result.success ? null : result.error.format();

    if (errors) {
      setError(() => ({
        account: errors.account?._errors ?? [],
        password: errors.password?._errors ?? [],
        passwordConfirm: errors.passwordConfirm?._errors ?? [],
      }));
    } else {
      resetUser(registerInfo);
    }
  }

  function onInputEnter(e: React.KeyboardEvent) {
    if (
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      e.key === "Enter"
    ) {
      onSubmit();
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
            openModel={openUpdateModel}
          />
        </>
      </ChartContainer>
      <ChartContainer title={<>使用者 (User)</>}>
        <>
          <span className="block py-2 text-sm">
            USER - 除權限管理外，所有功能
          </span>
          <PermissionTable
            users={data?.user || []}
            openModel={openUpdateModel}
          />
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
            openModel={openUpdateModel}
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
            openModel={openUpdateModel}
          />
        </>
      </ChartContainer>

      {/* user information model */}
      {userInfo && (
        <ModalExt
          header="使用者資訊"
          ths={["", "目前設定", "變更設定"]}
          caption={
            isUpdateError ? <Errors errors={[updateError.message]} /> : <></>
          }
          actions={[
            Boolean(userInfo.deletedAt) ? (
              <button
                key={`delete ${userInfo.account}`}
                className="mr-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-700"
                type="button"
                onClick={() => userUpdate && setIsRemoveComfirmModelOpen(true)}
              >
                刪除
              </button>
            ) : (
              <button
                key={`reset ${userInfo.account}`}
                className="mr-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-700"
                type="button"
                onClick={() => userUpdate && openResetModel(userInfo)}
              >
                重設密碼
              </button>
            ),
            <button
              key={`save ${userInfo.account}`}
              className="mr-2 rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() => userUpdate && updateUser(userUpdate)}
            >
              儲存變更
            </button>,
            <button
              key="closeModel"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={closeUpdateModel}
            >
              關閉
            </button>,
          ]}
          onCloseModel={closeUpdateModel}
        >
          <>
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
                    Boolean(userInfo.deletedAt) ? "inactive" : "active"
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
          </>
        </ModalExt>
      )}
      {isRemoveComfirmModelOpen && userUpdate && (
        <Modal
          header={`刪除帳號: ${userUpdate.account}`}
          actions={[
            <button
              key={`delete ${userUpdate.account}`}
              className="mr-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-700"
              type="button"
              onClick={() => removeUser({ account: userUpdate.account })}
            >
              刪除帳號
            </button>,
            <button
              key="closeModel-confirm"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={() => setIsRemoveComfirmModelOpen(false)}
            >
              關閉
            </button>,
          ]}
          onCloseModel={() => setIsRemoveComfirmModelOpen(false)}
        >
          <pre className="max-h-[60vh] text-lg leading-relaxed text-red-500">
            <b>確定要刪除此帳號?</b>
            <br />
            此動作無法復原，會一併刪除任何稽核紀錄。
            <br />
            <br />
            請按「確認刪除」刪除此帳號。
          </pre>
        </Modal>
      )}
      {isResetPasswordModelOpen && userUpdate && (
        <Modal
          header="重設密碼"
          actions={[
            <button
              key={`reset ${userUpdate.account}`}
              className="mr-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-red-700"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              確定變更
            </button>,
            <button
              key="closeModel-confirm"
              className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={() => setIsResetPasswordModelOpen(false)}
            >
              關閉
            </button>,
          ]}
          onCloseModel={() => setIsResetPasswordModelOpen(false)}
        >
          <form>
            <div className="relative mb-3 w-full">
              <label
                className="mb-2 block text-xs font-bold uppercase text-slate-600"
                htmlFor="account"
              >
                帳號
              </label>
              <span className="inline-block w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600">
                {registerInfo.account}
              </span>
              <Errors errors={error.account} />
            </div>

            <div className="relative mb-3 w-full">
              <label
                className="mb-2 block text-xs font-bold uppercase text-slate-600"
                htmlFor="password"
              >
                密碼
              </label>
              <input
                onChange={({ target }) => {
                  setRegisterInfo((d) => ({
                    ...d,
                    password: target.value,
                  }));
                  if (error.password.length > 0) {
                    setError((d) => ({ ...d, password: [] }));
                  }
                }}
                onKeyUp={onInputEnter}
                id="password"
                name="password"
                autoComplete="off"
                required={true}
                maxLength={32}
                minLength={6}
                type="password"
                className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                placeholder="Password"
              />
              <Errors errors={error.password} />
            </div>

            <div className="relative mb-3 w-full">
              <label
                className="mb-2 block text-xs font-bold uppercase text-slate-600"
                htmlFor="passwordConfirm"
              >
                再次輸入密碼
              </label>
              <input
                onChange={({ target }) => {
                  setRegisterInfo((d) => ({
                    ...d,
                    passwordConfirm: target.value,
                  }));
                  if (error.passwordConfirm.length > 0) {
                    setError((d) => ({ ...d, passwordConfirm: [] }));
                  }
                }}
                onKeyUp={onInputEnter}
                id="passwordConfirm"
                name="passwordConfirm"
                autoComplete="off"
                required={true}
                maxLength={32}
                minLength={6}
                type="password"
                className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                placeholder="Comfirm Password"
              />
              <Errors errors={error.passwordConfirm} />
            </div>

            {isError && <Errors errors={[trpcError.message]} />}
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
