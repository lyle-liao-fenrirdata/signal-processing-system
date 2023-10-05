import { MouseEventHandler, useState } from "react";
import Modal from "../commons/Modal";
import { useRouter } from "next/router";
import { env } from "@/env.mjs";

type DeleteModalProps = {
  onCloseModal: MouseEventHandler<HTMLButtonElement>;
  repo: string;
  tag: string;
};

export default function DeleteModal({
  onCloseModal,
  repo,
  tag,
}: DeleteModalProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  async function onDeleteTagSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsUploading(true);
    const form = e.target as HTMLFormElement;
    const url = new URL(form.action);
    console.log(url);
    const result = await fetch(url, {
      method: "DELETE",
      body: new FormData(form),
    });
    // if (result.ok) router.reload();
    setIsUploading(false);
  }

  return (
    <Modal
      header={`刪除 ${repo}:${tag}`}
      actions={[]}
      onCloseModal={onCloseModal}
    >
      <div className="min-w-[325px] py-6">
        <form
          action={env.NEXT_PUBLIC_MAIN_NODE_URL + "/api/registry"}
          className="flex grow flex-row flex-wrap gap-2 px-2"
          onSubmit={onDeleteTagSubmit}
        >
          <input
            type="hidden"
            name="repo"
            defaultValue={repo}
            className="peer grow rounded border-0 bg-transparent px-2 py-1 text-xs text-slate-700 placeholder-slate-700 shadow-none transition-all duration-150 ease-linear focus:border-none focus:outline-none"
          />
          <input
            type="hidden"
            name="tag"
            defaultValue={tag}
            className="peer grow rounded border-0 bg-transparent px-2 py-1 text-xs text-slate-700 placeholder-slate-500 shadow-none transition-all duration-150 ease-linear focus:border-none focus:outline-none"
          />
          <p className="w-full pb-8 text-base text-slate-700">
            確定要刪除 {repo}:{tag} 嗎？
          </p>
          <button
            type="submit"
            className="ml-auto rounded bg-red-700 px-2 py-1 text-xs text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:inline-block focus:outline-none active:inline-block active:bg-red-600 peer-focus:inline-block peer-active:inline-block"
          >
            確定刪除
          </button>
          <button
            type="button"
            disabled={isUploading}
            onClick={onCloseModal}
            className="mr-auto rounded bg-transparent px-8 py-2 text-xs font-bold text-slate-700 shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none disabled:opacity-50"
          >
            取消
          </button>
        </form>
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
