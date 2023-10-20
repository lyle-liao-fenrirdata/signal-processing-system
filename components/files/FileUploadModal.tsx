import { MouseEventHandler, useState } from "react";
import Modal from "../commons/Modal";
import { useRouter } from "next/router";
import { env } from "@/env.mjs";

type FileUploadModalProps = {
  onCloseModal: MouseEventHandler<HTMLButtonElement>;
  dir: string;
};

export default function FileUploadModal({
  onCloseModal,
  dir,
}: FileUploadModalProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<FileList | null>();
  const [uploadedFile, setUploadedFile] = useState<
    { name: string; error?: string }[]
  >([]);

  const filenames = Array.from(file || []).map(({ name }) => {
    const uploaded = uploadedFile.find((f) => f.name === name);
    if (uploaded && uploaded.error) return `${name}${` - ${uploaded.error}`}`;
    if (!uploaded) return name;
    return "";
  });

  const onSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsUploading(true);
    if (!file || !file.length) return;
    try {
      const results = await Promise.all(
        Array(file.length)
          .fill(0)
          .map(async (_, i) => {
            const data = new FormData();
            const theFile = file[i];
            data.set("dir", dir);
            data.set("file", theFile);
            if (uploadedFile.map((file) => file.name).includes(theFile.name))
              return;

            const res = await fetch(
              `${env.NEXT_PUBLIC_MAIN_NODE_URL}/api/files`,
              {
                method: "POST",
                body: data,
              }
            );
            const resBody = await res.json();
            if (resBody.ok) {
              setUploadedFile((prev) => [...prev, { name: theFile.name }]);
            } else {
              setUploadedFile((prev) => [
                ...prev,
                { name: theFile.name, error: "上傳失敗(可能原因: 檔名重複)" },
              ]);
            }

            return resBody as { ok: boolean };
          })
      );
      if (!results.filter((res) => !res?.ok).length) router.reload();
    } catch (e: any) {
      console.error(e);
    }
    setIsUploading(false);
  };

  return (
    <Modal
      header="選擇上傳檔案"
      actions={[
        <button
          key="submit-upload-form"
          type="button"
          disabled={isUploading || !file || !filenames.length}
          onClick={onSubmit}
          className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600 disabled:opacity-50"
        >
          上傳
        </button>,
      ]}
      onCloseModal={onCloseModal}
    >
      <form className="min-w-[325px] py-6" encType="multipart/form-data">
        <label
          className="mb-2 block text-sm text-slate-700"
          htmlFor="multiple_files"
        >
          選擇單一，或多個檔案
        </label>
        <input
          className="block w-full cursor-pointer rounded border border-slate-300 bg-slate-50 text-sm text-slate-900 focus:outline-none"
          id="file"
          name="file"
          type="file"
          onChange={(e) => {
            setUploadedFile([]);
            setFile(e.target.files);
          }}
          multiple
        />
        <p
          className="mt-1 whitespace-pre pl-1 text-sm text-slate-500"
          id="file_input_help"
        >
          {filenames.join("\n")}
        </p>
      </form>
    </Modal>
  );
}
