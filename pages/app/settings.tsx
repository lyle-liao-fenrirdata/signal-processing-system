import React from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";
import { Errors } from "@/components/commons/Errors";
import { UpdateUserInput, updateUserSchema } from "@/server/schema/auth.schema";
import { useRouter } from "next/router";
import ModalExtChangetPassword from "@/components/settings/ModalExtChangePassword";
import { Container } from "@/components/commons/Container";
import { formatDate } from "@/utils/formats";

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

export default function Settings({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    data,
    isError,
    error: queryError,
  } = trpc.auth.getSelfInfo.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    retryOnMount: false,
    retry: false,
  });
  const {
    mutate: updateUserInfo,
    isError: isUpdateError,
    error: updateError,
    isLoading,
  } = trpc.auth.updateSelfInfo.useMutation({
    retry: false,
    onSuccess: () => {
      router.reload();
    },
  });

  const [updateInfo, setUpdateInfo] = React.useState<UpdateUserInput>({
    username: "",
  });
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    React.useState(false);

  const [error, setError] = React.useState<{
    username: string[];
  }>({ username: [] });

  function onSubmit() {
    if (isLoading) return;

    const result = updateUserSchema.safeParse(updateInfo);
    const errors = result.success ? null : result.error.format();

    if (errors) {
      setError(() => ({
        username: errors.username?._errors ?? [],
      }));
    } else {
      updateUserInfo(updateInfo);
    }
  }

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "設定", href: "/app/settings" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      {!data ? (
        <Errors
          errors={isError ? [queryError.message] : ["無法找到你的資訊"]}
        />
      ) : (
        <Container
          title={
            <div className="flex justify-between text-center">
              <h6 className="text-xl font-bold text-slate-700">
                {data.account}
              </h6>
              <button
                className="rounded bg-slate-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                type="button"
                onClick={() => setIsChangePasswordModalOpen(true)}
              >
                變更密碼
              </button>
            </div>
          }
        >
          <form>
            <h6 className="mb-6 text-sm font-bold uppercase text-slate-400">
              個人資訊
            </h6>
            <div className="flex flex-wrap">
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    使用者名稱
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue={data.username}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    使用者權限
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue={data.role}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    帳號註冊時間
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue={formatDate.format(data.createdAt)}
                  />
                </div>
              </div>
              <div className="w-full px-4 lg:w-6/12">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    最後變更時間
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    defaultValue={formatDate.format(data.updatedAt)}
                  />
                </div>
              </div>
            </div>

            <hr className="border-b-1 mt-6 border-slate-300" />

            <h6 className="mb-6 mt-3 text-sm font-bold uppercase text-slate-400">
              變更設定
            </h6>
            <div className="flex flex-wrap gap-4">
              <div className="lg:w-12/12 w-full px-4">
                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    使用者名稱
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    value={updateInfo.username}
                    onChange={({ target }) => {
                      setUpdateInfo((d) => ({
                        ...d,
                        username: target.value,
                      }));
                      if (error.username.length > 0) {
                        setError((d) => ({ ...d, username: [] }));
                      }
                    }}
                  />
                </div>
                <Errors errors={error.username} />
              </div>
              {isUpdateError && <Errors errors={[updateError.message]} />}
              <button
                className="ml-auto mr-4 rounded bg-slate-700 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                type="button"
                onClick={onSubmit}
              >
                變更設定
              </button>
            </div>
          </form>
        </Container>
      )}

      {isChangePasswordModalOpen && data && (
        <ModalExtChangetPassword
          userAccount={{ account: data.account }}
          onCloseModal={() => setIsChangePasswordModalOpen(false)}
        />
      )}
    </AdminLayout>
  );
}
