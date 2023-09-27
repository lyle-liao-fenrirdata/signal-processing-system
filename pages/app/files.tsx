import { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Container } from "@/components/commons/Container";
import { env } from "@/env.mjs";
import { Role } from "@prisma/client";
import { formatDateTime, formatFileSize } from "@/utils/formats";
const DirAddModal = dynamic(() => import("@/components/files/DirAddModal"), {
  ssr: false,
});
const FileUploadModal = dynamic(
  () => import("@/components/files/FileUploadModal"),
  {
    ssr: false,
  }
);
const DeleteModal = dynamic(() => import("@/components/files/DeleteModal"), {
  ssr: false,
});
const RenameDirModal = dynamic(
  () => import("@/components/files/RenameDirModal"),
  {
    ssr: false,
  }
);

type DirContent = {
  files: {
    birthtimeMs: number;
    size: number;
    name: string;
  }[];
  dirs: {
    nfiles: number;
    ndirs: number;
    name: string;
  }[];
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
    const dirRes = await fetch(
      env.NEXT_PUBLIC_FILES_API_URL + `?dir=${encodeURIComponent(dir)}`
    );
    // console.log("\x1b[33m", dirRes.status, "\x1b[0m");
    dirContent = await dirRes.json();
  } catch {
    return {
      redirect: {
        destination: "/app/files",
        permanent: false,
      },
    };
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState("");

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
          <p>
            <i className="fa-solid fa-folder-tree pr-2"></i>
            {dir &&
              dir.split("/").map((d, i, arr) => (
                <Fragment key={d}>
                  {i + 1 === arr.length ? null : (
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() =>
                        router.push(
                          "/app/files?dir=" +
                            encodeURIComponent(arr.slice(0, i + 1).join("/"))
                        )
                      }
                    >
                      {d + "/"}
                    </span>
                  )}
                </Fragment>
              ))}
          </p>
          <hr className="border-b-1 my-4 border-slate-300" />
          {dirContent && (
            <>
              {dirContent.dirs.map((dirsDir) => (
                <div
                  key={"dir.path-" + dirsDir.name}
                  className="flex flex-row items-center gap-2 pl-1"
                >
                  <button
                    className="text-red-100 hover:text-red-500 disabled:text-transparent hover:disabled:text-transparent"
                    disabled={role !== Role.ADMIN}
                    onClick={() =>
                      setIsDeleteModalOpen(`${dir}${dirsDir.name}/`)
                    }
                  >
                    <i className="fas fa-folder-minus"></i>
                  </button>
                  <button
                    className="flex flex-row items-center gap-2 px-3 py-1 hover:text-slate-900"
                    onClick={() =>
                      router.push(
                        "/app/files?dir=" +
                          encodeURIComponent(`${dir}${dirsDir.name}/`)
                      )
                    }
                  >
                    <i className="fas fa-folder"></i>
                    {dirsDir.name}
                  </button>
                  <p className="ml-auto text-xs text-slate-700">
                    內有 {dirsDir.ndirs}個資料夾 {dirsDir.nfiles}個檔案
                  </p>
                  <button
                    className="text-slate-500 hover:text-slate-700"
                    onClick={() => setIsRenameModalOpen(dirsDir.name)}
                  >
                    <i className="fas fa-file-pen"></i>
                  </button>
                </div>
              ))}
              <hr className="border-b-1 my-4 border-slate-300" />
              {dirContent.files.map((file) => (
                <div
                  key={"dir.path-" + file.name}
                  className="flex flex-row items-center gap-2 pl-1"
                >
                  <button
                    className="text-red-100 hover:text-red-500"
                    onClick={() => setIsDeleteModalOpen(`${dir}${file.name}`)}
                  >
                    <i className="fas fa-file-excel px-1"></i>
                  </button>
                  <button
                    className="flex flex-row items-center gap-2 px-3 py-1 hover:text-slate-900"
                    // onClick={() => setDir(dir.path)}
                  >
                    <i className="fas fa-file"></i>
                    {file.name}
                  </button>
                  <p className="ml-auto text-xs text-slate-700">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-xs text-slate-700">
                    {formatDateTime.format(file.birthtimeMs)}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      </Container>

      {isUploadModalOpen && (
        <FileUploadModal
          dir={dir}
          onCloseModal={() => setIsUploadModalOpen(false)}
        />
      )}

      {isDirModalOpen && (
        <DirAddModal dir={dir} onCloseModal={() => setIsDirModalOpen(false)} />
      )}

      {!!isDeleteModalOpen && (
        <DeleteModal
          dir={isDeleteModalOpen}
          onCloseModal={() => setIsDeleteModalOpen("")}
        />
      )}

      {!!isRenameModalOpen && (
        <RenameDirModal
          dir={dir}
          currentName={isRenameModalOpen}
          onCloseModal={() => setIsRenameModalOpen("")}
        />
      )}
    </AdminLayout>
  );
}