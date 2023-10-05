import { useState } from "react";
// import dynamic from "next/dynamic";
import AdminLayout from "@/components/layouts/App";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "@/components/commons/Container";
import { env } from "@/env.mjs";
// const DeleteModal = dynamic(() => import("@/components/registry/DeleteModal"), {
//   ssr: false,
// });

type TagsList = {
  name: string;
  tags: string[];
};

export const getServerSideProps: GetServerSideProps<{
  username: string;
  role: string;
  repoTags: TagsList[];
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

  try {
    const _catalog = await fetch(env.REGISTRY_V2_URL + "_catalog");
    // if (!_catalog.ok)
    const repositories =
      ((await _catalog.json()).repositories as string[]) || [];

    const repoTags = await Promise.all(
      repositories.map(async (repoName) => {
        const tagsList = await fetch(
          env.REGISTRY_V2_URL + repoName + "/tags/list"
        );
        if (!tagsList.ok) {
          return {
            name: repoName,
            tags: [],
          };
        }
        return (await tagsList.json()) as TagsList;
      })
    );

    return {
      props: {
        username: decodeURIComponent(username),
        role,
        repoTags,
      },
    };
  } catch {
    return {
      props: {
        username: decodeURIComponent(username),
        role,
        repoTags: [],
      },
    };
  }
};

export default function Registry({
  username,
  role,
  repoTags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{
  //   repo: string;
  //   tag: string;
  // } | null>(null);

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "Registry Image", href: "/app/registry" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <Container
        title={
          <div className="flex justify-between text-center">
            <div className="flex flex-col items-start ">
              <h6 className="text-xl font-bold text-slate-700">Image 列表</h6>
            </div>
          </div>
        }
      >
        <div className="text-sm text-slate-700">
          {repoTags && (
            <>
              {/* directory */}
              {repoTags.map((repoTag) => (
                <div
                  key={"repo-" + repoTag.name}
                  className="flex flex-row items-center gap-2 hover:bg-white"
                >
                  <span className="flex flex-row items-center gap-2 px-3 py-2">
                    <i className="fa-solid fa-file-image"></i>
                    {repoTag.name}
                  </span>
                  <div className="ml-auto flex flex-row gap-2 px-3 text-xs text-white">
                    {repoTag.tags.map((tag) => (
                      // <button
                      //   key={"repo-" + repoTag.name + "-tag-" + tag}
                      //   className=" rounded bg-indigo-700 px-2 py-1 hover:opacity-70"
                      //   onClick={() =>
                      //     setIsDeleteModalOpen({ repo: repoTag.name, tag })
                      //   }
                      // >
                      //   {tag}
                      // </button>
                      <span
                        key={"repo-" + repoTag.name + "-tag-" + tag}
                        className=" rounded bg-indigo-700 px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              <hr className="border-b-1 my-4 border-slate-300" />
            </>
          )}
        </div>
      </Container>

      {/* {!!isDeleteModalOpen && (
        <DeleteModal
          repo={isDeleteModalOpen.repo}
          tag={isDeleteModalOpen.tag}
          onCloseModal={() => setIsDeleteModalOpen(null)}
        />
      )} */}
    </AdminLayout>
  );
}
