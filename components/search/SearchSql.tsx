import Image from "next/image";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Flex2ColExt } from "@/components/search/Flex2ColExt";
import { ChartContainer } from "../commons/ChartContainer";
import Modal from "../commons/Modal";
import { env } from "@/env.mjs";

export default function SearchSql() {
  const [sqlSearch, setSqlSearch] = useState({
    query: "",
    fetch_size: 10,
  });
  const [showSqlSearchModal, setSqlSearchModal] = useState(false);

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

  return (
    <>
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
          onCloseModal={() => setSqlSearchModal(false)}
        >
          <pre className="max-h-[60vh] text-sm leading-relaxed text-slate-500">
            Elastic Query:
            <br />
            {JSON.stringify(elasticSearchTranslate.data, undefined, 4)}
          </pre>
        </Modal>
      )}
    </>
  );
}
