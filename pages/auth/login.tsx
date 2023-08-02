import { MouseEvent, useEffect, useState } from "react";
import Link from "next/link";

import AuthLayout from "components/layouts/Auth";
import { trpc } from "@/utils/trpc";
import { loginUserSchema } from "@/server/schema/auth.schema";
import { useRouter } from "next/router";
import { useUserTokenStore } from "@/stores/userToken";

const Errors = ({ errors }: { errors: string[] }) => {
  if (!errors.length) return null;
  return (
    <>
      {errors.map((err) => (
        <p key={err} className="pl-1 pt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </>
  );
};

export default function Login() {
  const router = useRouter();
  const setToken = useUserTokenStore((state) => state.setToken);
  const [error, setError] = useState<{
    username: string[];
    password: string[];
  }>({ username: [], password: [] });
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const {
    isSuccess,
    isError,
    refetch,
    data,
    error: trpcError,
  } = trpc.auth.login.useQuery(userInfo, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
    enabled: false,
  });

  function onSubmit(e: MouseEvent) {
    e.preventDefault();
    const result = loginUserSchema.safeParse(userInfo);
    const errors = result.success ? null : result.error.format();
    if (errors) {
      //  setError(Object.values(errors));
      setError(() => ({
        username: errors.username?._errors ?? [],
        password: errors.password?._errors ?? [],
      }));
    } else {
      refetch();
    }
  }

  useEffect(() => {
    if (isSuccess) setToken(data.token);

    router.push("/app/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  return (
    <AuthLayout>
      <div className="container mx-auto h-full px-4">
        <div className="flex h-full content-center items-center justify-center">
          <div className="w-full px-4 lg:w-4/12">
            <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 bg-slate-200 shadow-lg">
              <div className="mb-0 rounded-t px-6 py-6">
                <div className="mb-3 text-center">
                  <h6 className="text-sm font-bold text-slate-500">
                    訊號處理系統
                  </h6>
                </div>
                <hr className="border-b-1 mt-6 border-slate-300" />
              </div>
              <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                <form>
                  <div className="relative mb-3 w-full">
                    <label
                      className="mb-2 block text-xs font-bold uppercase text-slate-600"
                      htmlFor="grid-password"
                    >
                      帳號
                    </label>
                    <input
                      onChange={({ target }) => {
                        setUserInfo((d) => ({ ...d, username: target.value }));
                        if (error.username.length > 0) {
                          setError((d) => ({ ...d, username: [] }));
                        }
                      }}
                      id="username"
                      name="username"
                      autoComplete="off"
                      autoFocus={true}
                      required={true}
                      maxLength={100}
                      minLength={1}
                      type="text"
                      className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                      placeholder="USERNAME"
                    />
                    <Errors errors={error.username} />
                  </div>

                  <div className="relative mb-3 w-full">
                    <label
                      className="mb-2 block text-xs font-bold uppercase text-slate-600"
                      htmlFor="grid-password"
                    >
                      密碼
                    </label>
                    <input
                      onChange={({ target }) => {
                        setUserInfo((d) => ({ ...d, password: target.value }));
                        if (error.password.length > 0) {
                          setError((d) => ({ ...d, password: [] }));
                        }
                      }}
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

                  {isError && <Errors errors={[trpcError.message]} />}
                  <div className="mt-6 text-center">
                    <button
                      className="mb-1 mr-1 w-full rounded bg-slate-800 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-600"
                      type="button"
                      onClick={onSubmit}
                    >
                      登入
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="relative mt-6 flex flex-wrap justify-end">
              <Link href="/auth/register" className="text-slate-200">
                <small>新建使用者</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
