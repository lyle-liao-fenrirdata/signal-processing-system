import { MouseEventHandler, useState } from "react";
import Modal from "../commons/Modal";
import { useRouter } from "next/router";
import { env } from "@/env.mjs";

type DeleteModalProps = {
  onCloseModal: MouseEventHandler<HTMLButtonElement>;
  dir: string;
};

export default function DeleteModal({ onCloseModal, dir }: DeleteModalProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const onDirSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUploading(true);
    if (!dir) return;
    try {
      const res = await fetch(
        env.NEXT_PUBLIC_FILES_API_URL + `?dirToDel=${encodeURIComponent(dir)}`,
        {
          method: "DELETE",
        }
      );
      const resBody = await res.json();
      if (resBody.ok) {
        router.reload();
      } else {
        setError("建立失敗(可能原因: 路徑不存在)");
      }
    } catch (e: any) {
      console.error(e);
    }
    setIsUploading(false);
  };

  return (
    <Modal
      header={`刪除路徑(${
        dir.charAt(dir.length - 1) === "/" ? "資料夾" : "檔案"
      })`}
      actions={[
        <button
          key="submit-delete-confirm"
          type="button"
          disabled={isUploading}
          onClick={onDirSubmit}
          className="mr-2 rounded bg-red-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-red-600 disabled:opacity-50"
        >
          確定刪除
        </button>,
        <button
          key="submit-delete-cancel"
          type="button"
          disabled={isUploading}
          onClick={onCloseModal}
          className="rounded bg-transparent px-4 py-2 text-xs font-bold text-slate-700 shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none disabled:opacity-50"
        >
          取消
        </button>,
      ]}
      onCloseModal={onCloseModal}
    >
      <div className="min-w-[325px] py-6">
        <p className="mb-2 block text-sm text-slate-700">{dir}</p>
        <p
          className="mt-1 whitespace-pre pl-1 text-sm text-slate-500"
          id="file_input_help"
        >
          {error}
        </p>
      </div>
    </Modal>
  );
}
