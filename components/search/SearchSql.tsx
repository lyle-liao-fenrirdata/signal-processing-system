import Image from "next/image";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Flex2ColExt } from "@/components/search/Flex2ColExt";
import { ChartContainer } from "../commons/ChartContainer";
import { env } from "@/env.mjs";

export default function SearchSql() {
  const example = JSON.stringify(
    {
      from: 10,
      size: 1,
      query: {
        match: {
          "message.addr": "192.168.16.192",
        },
      },
      _source: {
        excludes: ["*Padding_bytes", "*GSE_data_bytes"],
      },
    },
    undefined,
    4
  );
  const [sqlSearch, setSqlSearch] = useState({
    query: "select * from parase_test_parse_gse",
    fetch_size: 10,
  });
  const [result, setResult] = useState(null);
  const { mutate } = trpc.sqlTranslate.useMutation({
    retry: false,
    onSuccess: (data) => {
      if (data) {
        setResult(data);
      }
    },
  });

  async function postElasticSearchTranslate() {
    mutate(sqlSearch);
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
    <Flex2ColExt
      left={
        // SQL to ES translate
        <>
          <ChartContainer title={<>SQL to ES</>}>
            <div className="mb-3 flex flex-col flex-nowrap items-start gap-2 pt-2">
              <span>請輸入 SQL 語句</span>
              <input
                type="text"
                value={sqlSearch.query}
                placeholder="SELECT * FROM arkime_files"
                className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                onChange={(e) => {
                  const query = e.target.value.replaceAll(
                    /[;;\/\+\@\#\$\^\{\}\<\>]/g,
                    ""
                  );
                  setSqlSearch((d) => ({
                    ...d,
                    query,
                  }));
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") postElasticSearchTranslate();
                }}
              />
              <div className="flex w-full flex-row flex-nowrap items-center justify-start">
                <input
                  type="text"
                  value={sqlSearch.fetch_size}
                  placeholder="select * from parase_test_parse_gse"
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

          <ChartContainer title={<>Elastic Query</>}>
            <>
              <div className="relative w-full flex-auto overflow-y-auto px-6 pb-2">
                <pre className="max-h-[60vh] pt-2 text-sm leading-relaxed text-slate-500">
                  {!result
                    ? "無查詢結果"
                    : JSON.stringify(result, undefined, 4)}
                </pre>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 pt-3">
                <button
                  key={`SQL: ${sqlSearch.query}`}
                  className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600 disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                  type="button"
                  disabled={!result}
                  onClick={() =>
                    copyToClipboard(JSON.stringify(result, undefined, 4))
                  }
                >
                  <i className="fas fa-copy"></i> 複製 ES Query
                </button>
              </div>
            </>
          </ChartContainer>
        </>
      }
      right={
        // other hyper link (Arkime and Kibana)
        <>
          <ChartContainer title={<>其他檢索工具</>}>
            <div className="flex flex-col flex-nowrap items-center gap-2 pt-2">
              <a
                href={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_KIBANA_PORT}/app/dev_tools`}
                target="_blank"
              >
                <Image
                  src="/img/Arkime_Logo.png"
                  alt="Arkime"
                  width={159}
                  height={48}
                  className="opacity-80 transition-all duration-300 hover:scale-110 hover:opacity-100"
                />
              </a>
              <div className="flex flex-col">
                <p>
                  username:{" "}
                  <button
                    type="button"
                    onClick={() => copyToClipboard("reader")}
                    className="hover:opacity-70"
                  >
                    reader
                  </button>
                </p>
                <p>
                  password:{" "}
                  <button
                    type="button"
                    onClick={() => copyToClipboard("1qaz2wsx")}
                    className="hover:opacity-70"
                  >
                    ********
                  </button>
                </p>
              </div>
            </div>
          </ChartContainer>

          <ChartContainer title={<>Kibana查詢範例</>}>
            <div className="flex flex-col flex-nowrap items-start gap-2 pt-2">
              <span className="whitespace-pre">{example}</span>

              <button
                className="ml-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs text-slate-500 outline-none transition-all duration-150 ease-linear hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                type="button"
                onClick={() => copyToClipboard(example)}
              >
                <i className="fas fa-copy"></i> 複製
              </button>
            </div>
          </ChartContainer>
        </>
      }
    />
  );
}
