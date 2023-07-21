import { ReactElement } from "react";
import Link from "next/link";

import AuthLayout from "components/layouts/Auth";

export default function Register() {
  return (
    <div className="container mx-auto h-full px-4">
      <div className="flex h-full content-center items-center justify-center">
        <div className="w-full px-4 lg:w-4/12">
          <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg border-0 bg-slate-200 shadow-lg">
            <div className="mb-0 rounded-t px-6 py-6">
              <div className="mb-3 text-center">
                <h6 className="text-sm font-bold text-slate-500">新建使用者</h6>
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
                    姓名
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    placeholder="Name"
                  />
                </div>

                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    帳號
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    placeholder="Account"
                  />
                </div>

                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    密碼
                  </label>
                  <input
                    type="password"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    placeholder="Password"
                  />
                </div>

                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-slate-600"
                    htmlFor="grid-password"
                  >
                    再次輸入密碼
                  </label>
                  <input
                    type="password"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-slate-600 placeholder-slate-300 shadow transition-all duration-150 ease-linear focus:outline-none focus:ring"
                    placeholder="Password"
                  />
                </div>

                <div className="mt-6 text-center">
                  <button
                    className="mb-1 mr-1 w-full rounded bg-slate-800 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-600"
                    type="button"
                  >
                    新建帳號
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="relative mt-6 flex flex-wrap justify-end">
            <Link href="/auth/login" className="text-slate-200">
              <small>返回帳號登入</small>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
