import React from "react";
import Modal from "../commons/Modal";
import { Errors } from "../commons/Errors";
import {
  ResetUserPasswordInput,
  resetUserPasswordSchema,
} from "@/server/schema/permission.schema";
import { trpc } from "@/utils/trpc";
import { UserInfo } from "@/pages/app/permission";

type ModalExtResetPasswordProps = {
  userAccount: Pick<UserInfo, "account">;
  onCloseModal: () => void;
};

export default function ModalExtResetPassword({
  userAccount,
  onCloseModal,
}: ModalExtResetPasswordProps) {
  const {
    mutate: resetUser,
    isLoading,
    isError,
    error: trpcError,
  } = trpc.permission.resetPassword.useMutation({
    retry: false,
    onSuccess: () => {
      onCloseModal();
    },
  });

  const [registerInfo, setRegisterInfo] =
    React.useState<ResetUserPasswordInput>({
      account: "",
      password: "",
      passwordConfirm: "",
    });
  const [error, setError] = React.useState<{
    account: string[];
    password: string[];
    passwordConfirm: string[];
  }>({ account: [], password: [], passwordConfirm: [] });

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
      if (!registerInfo.password || !registerInfo.passwordConfirm) {
        setError({
          account: [],
          password: ["密碼不可空白"],
          passwordConfirm: [],
        });
        return;
      }
      if (registerInfo.password !== registerInfo.passwordConfirm) {
        setError({
          account: [],
          password: ["兩次密碼輸入不同"],
          passwordConfirm: [],
        });
        return;
      }
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

  React.useEffect(() => {
    setRegisterInfo(() => ({
      account: userAccount.account,
      password: "",
      passwordConfirm: "",
    }));
  }, [userAccount]);

  return (
    <Modal
      header="重設密碼"
      actions={[
        <button
          key={`reset ${userAccount.account}`}
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
          key="closeModal-confirm"
          className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
          type="button"
          onClick={onCloseModal}
        >
          關閉
        </button>,
      ]}
      onCloseModal={onCloseModal}
    >
      <form>
        <div className="relative mb-3 w-full">
          <label
            className="mb-2 block text-xs font-bold text-slate-600"
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
            className="mb-2 block text-xs font-bold text-slate-600"
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
            className="mb-2 block text-xs font-bold text-slate-600"
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
  );
}
