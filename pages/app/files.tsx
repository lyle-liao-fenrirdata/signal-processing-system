import React, { useState } from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Container } from "@/components/commons/Container";
import { env } from "@/env.mjs";
const DirAddModal = dynamic(() => import("@/components/files/DirAddModal"), {
  ssr: false,
});
const FileUploadModal = dynamic(
  () => import("@/components/files/FileUploadModal"),
  {
    ssr: false,
  }
);

type DirContent = {
  files: string[];
  dirs: string[];
};

export const getServerSideProps: GetServerSideProps<{
  username: string;
  role: string;
  dir: string;
  dirContent: DirContent;
}> = async ({ req, query }) => {
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

  const dir = decodeURIComponent(`${(query.dir as string) || "home/"}`);
  let dirContent: DirContent = {
    files: [],
    dirs: [],
  };
  try {
    // console.log("\x1b[33m", dirContent, "\x1b[0m");
    const dirRes = await fetch(
      env.NEXT_PUBLIC_FILES_API_URL + `?dir=${encodeURIComponent(dir)}`
    );
    dirContent = await dirRes.json();
  } catch (e) {
    console.error(String(e));
  }

  return {
    props: {
      username: decodeURIComponent(username),
      role,
      dir,
      dirContent,
    },
  };
};

export default function Settings({
  username,
  role,
  dir,
  dirContent,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDirModalOpen, setIsDirModalOpen] = useState(false);

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "MongoDB 檔案管理", href: "/app/files" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <Container
        title={
          <div className="flex justify-between text-center">
            <div className="flex flex-col items-start ">
              <h6 className="text-xl font-bold text-slate-700">檔案列表</h6>
            </div>
            <div className="flex flex-row gap-4">
              <button
                className="rounded border border-solid border-slate-700 bg-transparent px-4 py-2 text-xs font-bold text-slate-700 shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                type="button"
                onClick={() => setIsDirModalOpen(true)}
              >
                <i className="fas fa-folder-plus"> 資料夾</i>
              </button>
              <button
                className="rounded bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-slate-600"
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <i className="fas fa-file-import"> 檔案</i>
              </button>
            </div>
          </div>
        }
      >
        {/* <p className="">當前路徑: {dir}</p> */}
        <div className="text-sm text-slate-700">
          <p className="">當前路徑: {dir}</p>
          <hr className="border-b-1 my-4 border-slate-300" />
          {dirContent && (
            <>
              {dirContent.dirs.map((dirname) => (
                <button
                  key={"dir.path-" + dirname}
                  className="flex flex-row items-center gap-2 px-3 py-1 hover:text-slate-900"
                  onClick={() =>
                    router.push(
                      "/app/files?dir=" +
                        encodeURIComponent(`${dir}/${dirname}`)
                    )
                  }
                >
                  <i className="fas fa-folder"></i>
                  {dirname}
                </button>
              ))}
              <hr className="border-b-1 my-4 border-slate-300" />
              {dirContent.files.map((filename) => (
                <button
                  key={"dir.path-" + filename}
                  className="flex flex-row items-center gap-2 px-3 py-1 hover:text-slate-900"
                  // onClick={() => setDir(dir.path)}
                >
                  <i className="fas fa-file"></i>
                  {filename}
                </button>
              ))}
            </>
          )}
        </div>
      </Container>

      {isUploadModalOpen && (
        <FileUploadModal onCloseModal={() => setIsUploadModalOpen(false)} />
      )}

      {isDirModalOpen && (
        <DirAddModal onCloseModal={() => setIsDirModalOpen(false)} />
      )}
    </AdminLayout>
  );
}
