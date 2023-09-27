import { MouseEventHandler, useState } from "react";
import Modal from "../commons/Modal";
import { useRouter } from "next/router";
import { env } from "@/env.mjs";

const notAllowedFilename = /[\\/:*?"<>|'"]/g;

type RenameDirModalProps = {
  onCloseModal: MouseEventHandler<HTMLButtonElement>;
  dir: string;
  currentName: string;
};

export default function RenameDirModal({
  onCloseModal,
  dir,
  currentName,
}: RenameDirModalProps) {
  const router = useRouter();
  const [dirname, setDirname] = useState<string>(() => currentName);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const onRenameDirSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUploading(true);
    if (!dirname || dirname.match(notAllowedFilename)) return;
    try {
      const res = await fetch(env.NEXT_PUBLIC_FILES_API_URL, {
        method: "PATCH",
        body: JSON.stringify({
          oldPath: dir + currentName,
          newPath: dir + dirname,
        }),
      });
      const resBody = await res.json();
      if (resBody.ok) {
        router.reload();
      } else {
        setError("更新失敗(可能原因: 路徑重複)");
      }
    } catch (e: any) {
      console.error(e);
    }
    setIsUploading(false);
  };

  return (
    <Modal
      header="輸入新資料夾名稱"
      actions={[
        <button
          key="submit-upload-form"
          type="button"
          disabled={isUploading || !dirname}
          onClick={onRenameDirSubmit}
          className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600 disabled:opacity-50"
        >
          變更
        </button>,
      ]}
      onCloseModal={onCloseModal}
    >
      <form className="min-w-[325px] py-6" encType="multipart/form-data">
        <label
          className="mb-2 block text-sm text-slate-700"
          htmlFor="multiple_files"
        >
          新名稱
        </label>
        <input
          className="block w-full cursor-pointer rounded border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none"
          id="dirname"
          name="dirname"
          type="text"
          value={dirname}
          onChange={(e) => {
            const v = e.target.value;
            if (v.match(notAllowedFilename)) return;
            setDirname(e.target.value);
          }}
        />
        <p
          className="mt-1 whitespace-pre pl-1 text-sm text-slate-500"
          id="file_input_help"
        >
          {error}
        </p>
      </form>
    </Modal>
  );
}
