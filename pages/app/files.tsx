import React from "react";

import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { trpc } from "@/utils/trpc";
import { Errors } from "@/components/commons/Errors";
import { UpdateUserInput, updateUserSchema } from "@/server/schema/auth.schema";
import { useRouter } from "next/router";
import { Container } from "@/components/commons/Container";
import Modal from "@/components/commons/Modal";

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
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [file, setFile] = React.useState<FileList | null>();
  const [uploadedFile, setUploadedFile] = React.useState<string[]>([]);
  const filenames = Array.from(file || [])
    .map((file) => file.name)
    .filter((name) => !uploadedFile.includes(name));

  const {
    data,
    isError,
    error: queryError,
    refetch: refetchFiles,
  } = trpc.files.getFiles.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    retryOnMount: false,
    retry: false,
  });
  console.log(data);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      await Promise.all(
        Array(file.length)
          .fill(0)
          .map(async (_, i) => {
            const data = new FormData();
            const theFile = file[i];
            data.set("file", theFile);
            const res = await fetch("/api/upload", {
              method: "POST",
              body: data,
            });
            const resBody = await res.json();
            if (resBody.ok) setUploadedFile((prev) => [...prev, theFile.name]);
          })
      );
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "MongoDB 檔案管理", href: "/app/files" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      {isError || !data ? (
        <Errors errors={queryError ? [queryError.message] : ["無法找到資訊"]} />
      ) : (
        <Container
          title={
            <div className="flex justify-between text-center">
              <h6 className="text-xl font-bold text-slate-700">檔案列表</h6>
              <div className="flex flex-row gap-4">
                <button
                  className="rounded border border-solid border-slate-700 bg-transparent px-4 py-2 text-xs font-bold text-slate-700 shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={() => {}}
                >
                  新增資料夾
                </button>
                <button
                  className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  上傳檔案
                </button>
              </div>
            </div>
          }
        >
          <form>
            <h6 className="mb-6 text-sm font-bold text-slate-400">個人資訊</h6>
            <div className="flex flex-wrap"></div>

            <hr className="border-b-1 mt-6 border-slate-300" />

            <h6 className="mb-6 mt-3 text-sm font-bold text-slate-400">
              變更設定
            </h6>
            <div className="flex flex-wrap gap-4"></div>
          </form>
        </Container>
      )}

      {isUploadModalOpen && (
        <Modal
          header="選擇上傳檔案"
          actions={[]}
          onCloseModal={() => setIsUploadModalOpen(false)}
        >
          <form
            onSubmit={onSubmit}
            className="min-w-[325px] pb-2 pt-6"
            encType="multipart/form-data"
          >
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
              onChange={(e) => setFile(e.target.files)}
              multiple
            />
            <p
              className="mt-1 whitespace-pre pl-1 text-sm text-slate-500"
              id="file_input_help"
            >
              {filenames.join("\n")}
            </p>
            <div className="flex flex-row justify-end pt-4">
              <button
                type="submit"
                className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
              >
                上傳
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
