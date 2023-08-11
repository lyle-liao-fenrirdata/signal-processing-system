import AdminLayout from "components/layouts/Admin";
import Image from "next/image";
import { env } from "@/env.mjs";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ChartContainer } from "@/components/commons/ChartContainer";
import { Flex2ColExt } from "@/components/search/Flex2ColExt";
import { useState } from "react";
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

export default function Search({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [sqlSearch, setSqlSearch] = useState({
    query: "",
    fetch_size: 10,
  });
  const [showSqlSearchModal, setSqlSearchModal] = useState(false);
  const [arkimiSearch, setArkimiSearch] = useState({
    host: env.NEXT_PUBLIC_ARKIME_URL,
    port: env.NEXT_PUBLIC_ARKIME_PORT,
    query: " ",
    stopTime: null,
    startTime: null,
    arkime_node: "arkime01-node",
    ip_src: "192.168.15.31",
  });
  const [showArkimeSearchPayloadModal, setArkimeSearchPayloadModal] =
    useState("");

  const elasticSearchTranslate = trpc.sqlTranslate.useQuery(sqlSearch, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
    enabled: false,
  });
  async function postElasticSearchTranslate() {
    await elasticSearchTranslate.refetch();
    setSqlSearchModal(true);
  }

  async function copyToClipboard(text: string) {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.warn("Copy failed", error);
    }
  }

  const arkimeSearchPayload = trpc.arkime.searchPayload.useQuery(arkimiSearch, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
    enabled: false,
  });

  function postArkimeSearchPayload() {
    arkimeSearchPayload.refetch();
  }

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "資料檢索", href: "/app/search" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <Flex2ColExt
        left={
          // SQL to ES translate
          <ChartContainer title={<>SQL to ES</>}>
            <div className="mb-3 flex flex-col flex-nowrap items-start gap-2 pt-2">
              <span>請輸入 SQL 語句</span>
              <input
                type="text"
                value={sqlSearch.query}
                placeholder="SELECT * FROM arkime_files"
                className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                onChange={(e) =>
                  setSqlSearch((d) => ({
                    ...d,
                    query: e.target.value,
                  }))
                }
                onKeyUp={(e) => {
                  if (e.key === "Enter") postElasticSearchTranslate();
                }}
              />
              <div className="flex w-full flex-row flex-nowrap items-center justify-start">
                <input
                  type="text"
                  value={sqlSearch.fetch_size}
                  placeholder="SELECT * FROM arkime_files"
                  className="relative w-1/2 rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={({ target }) => {
                    const fetch_size = Number(target.value);
                    if (fetch_size && fetch_size > 0) {
                      setSqlSearch((d) => ({
                        ...d,
                        fetch_size,
                      }));
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") postElasticSearchTranslate();
                  }}
                />
                <button
                  className="ml-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={() => {
                    postElasticSearchTranslate();
                  }}
                >
                  送出
                </button>
              </div>
            </div>
          </ChartContainer>
        }
        right={
          // other hyper link (Arkime and Kibana)
          <ChartContainer title={<>其他檢索工具</>}>
            <div className="flex flex-col flex-nowrap items-center gap-2 pt-2">
              {/* <a
                href={`${env.NEXT_PUBLIC_ARKIME_URL}:${env.NEXT_PUBLIC_ARKIME_PORT}`}
                target="_blank"
              >
                <Image
                  src="/img/Arkime_Logo.png"
                  alt="Arkime"
                  width={159}
                  height={48}
                  className="opacity-80 transition-all duration-300 hover:scale-110 hover:opacity-100"
                />
              </a> */}
              <a
                href={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_KIBANA_PORT}/app/kibana_overview/`}
                target="_blank"
                className="flex h-12 flex-row flex-nowrap items-center justify-start opacity-80 transition-all duration-300 hover:scale-110 hover:opacity-100"
              >
                <Image
                  src="/img/Kibana_Elasticsearch_Logo.svg"
                  alt="Kibana Elasticsearch"
                  width={40}
                  height={40}
                />
                <span className="text-3xl font-extrabold text-[#2F2F2F]">
                  Kibana
                </span>
              </a>
            </div>
          </ChartContainer>
        }
      />
      {/* our data search function */}
      <ChartContainer title={<>解析資料檢索</>}>
        <div className="mb-3 pt-2">
          <div className="mb-4 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
            <div className="flex flex-col items-start gap-2">
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-fit whitespace-nowrap">
                  Arikime Viewer Host
                </span>
                <input
                  type="text"
                  value={arkimiSearch.host}
                  placeholder={env.NEXT_PUBLIC_ARKIME_URL}
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={(e) =>
                    setArkimiSearch((d) => ({
                      ...d,
                      host: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") postArkimeSearchPayload();
                  }}
                />
              </div>
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-fit whitespace-nowrap">
                  Arikime Viewer Port
                </span>
                <input
                  type="text"
                  value={arkimiSearch.port}
                  placeholder="8005"
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={(e) =>
                    setArkimiSearch((d) => ({
                      ...d,
                      port: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") postArkimeSearchPayload();
                  }}
                />
              </div>
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-fit whitespace-nowrap">
                  Arkime Capturer Node
                </span>
                <input
                  type="text"
                  value={arkimiSearch.arkime_node}
                  placeholder="arkime01-node"
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={(e) =>
                    setArkimiSearch((d) => ({
                      ...d,
                      arkime_node: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") postArkimeSearchPayload();
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-fit whitespace-nowrap">封包IP來源</span>
                <input
                  type="text"
                  value={arkimiSearch.ip_src}
                  placeholder="192.168.15.31"
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={(e) =>
                    setArkimiSearch((d) => ({
                      ...d,
                      ip_src: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") postArkimeSearchPayload();
                  }}
                />
              </div>
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-fit whitespace-nowrap">檢索文字</span>
                <input
                  type="text"
                  value={arkimiSearch.query}
                  placeholder="測試"
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={(e) =>
                    setArkimiSearch((d) => ({
                      ...d,
                      query: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") postArkimeSearchPayload();
                  }}
                />
              </div>
              <button
                className="ml-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                type="button"
                onClick={() => {
                  postArkimeSearchPayload();
                }}
              >
                查詢
              </button>
            </div>
          </div>
          {/* our data search result */}
          <div className="max-h-[70vh] w-full overflow-auto">
            <table className="w-full border-collapse items-center bg-transparent">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Source
                  </th>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Destination
                  </th>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Payload
                  </th>
                </tr>
              </thead>
              <tbody>
                {arkimeSearchPayload.isSuccess &&
                  Object.keys(arkimeSearchPayload.data).map((key) => {
                    const val = arkimeSearchPayload.data[key];
                    return (
                      <tr key={key}>
                        <th className="border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {JSON.stringify(val.source, undefined, 4)}
                        </th>
                        <td className="border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          {JSON.stringify(val.destination, undefined, 4)}
                        </td>
                        <td className="border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
                          <div
                            className="dangerouslySetInnerHTML"
                            dangerouslySetInnerHTML={{
                              __html: val.payload,
                            }}
                          ></div>
                          <button
                            className="ml-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                            type="button"
                            onClick={() => {
                              setArkimeSearchPayloadModal(val.payload);
                            }}
                          >
                            Show Content
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </ChartContainer>

      {/* modal of "SQL to ES translate" result */}
      {showSqlSearchModal && (
        <Modal
          header={`SQL: ${sqlSearch.query}`}
          actions={[
            <button
              key={`SQL: ${sqlSearch.query}`}
              className="mr-2 rounded border border-solid border-slate-500 bg-transparent px-6 py-3 text-sm font-bold text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
              type="button"
              onClick={() =>
                copyToClipboard(
                  JSON.stringify(elasticSearchTranslate.data, undefined, 4)
                )
              }
            >
              <i className="fas fa-copy"></i> 複製 Elascti Query
            </button>,
            <button
              key="closeModal-sql"
              className="rounded bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() => setSqlSearchModal(false)}
            >
              OK
            </button>,
          ]}
          onCloseModel={() => setSqlSearchModal(false)}
        >
          <pre className="max-h-[60vh] text-sm leading-relaxed text-slate-500">
            Elastic Query:
            <br />
            {JSON.stringify(elasticSearchTranslate.data, undefined, 4)}
          </pre>
        </Modal>
      )}
      {/* modal of "Arkime Search Payload" result */}
      {showArkimeSearchPayloadModal !== "" && arkimeSearchPayload.isSuccess && (
        <Modal
          header="Payload"
          actions={[
            <button
              key="closeModal-payload"
              className="rounded bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
              type="button"
              onClick={() => setArkimeSearchPayloadModal("")}
            >
              OK
            </button>,
          ]}
          onCloseModel={() => setArkimeSearchPayloadModal("")}
        >
          <pre className="max-h-[60vh] text-sm leading-relaxed text-slate-500">
            <div
              dangerouslySetInnerHTML={{
                __html: showArkimeSearchPayloadModal,
              }}
            ></div>
          </pre>
        </Modal>
      )}
    </AdminLayout>
  );
}
