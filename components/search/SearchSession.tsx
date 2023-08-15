import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ChartContainer } from "../commons/ChartContainer";
import { env } from "@/env.mjs";
import { ArkimeSessionData } from "@/server/routers/arkime";
import { Errors } from "../commons/Errors";
import { ArkimeSearchSessionInput } from "@/server/schema/arkime.schema";

export default function SearchSession() {
  const [arkimiSearch, setArkimiSearch] = useState<ArkimeSearchSessionInput>({
    host: "http://192.168.16.32",
    arkime_node: "dac02",
    expression: "file = *out*",
  });
  const [searchResult, setSearchResult] = useState<ArkimeSessionData["data"]>(
    []
  );

  const { mutate, isError, error, isLoading } =
    trpc.arkime.searchSession.useMutation({
      retry: false,
      onSuccess: (data) => {
        if (data) setSearchResult(() => data.data);
      },
      onError: (error) => console.log(error),
    });

  function onSubmit() {
    setSearchResult([]);
    mutate(arkimiSearch);
  }

  return (
    <>
      <ChartContainer title={<>解析資料檢索(Session)</>}>
        <div className="mb-3 pt-2">
          <div className="mb-4 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
            <div className="flex flex-col items-start gap-2">
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[180px] whitespace-nowrap">
                  Arikime Viewer Host URL
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
                    if (e.key === "Enter") onSubmit();
                  }}
                />
              </div>
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-[180px] whitespace-nowrap">
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
                    if (e.key === "Enter") onSubmit();
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
                <span className="min-w-fit whitespace-nowrap">檢索文字</span>
                <input
                  type="text"
                  value={arkimiSearch.expression}
                  placeholder="測試"
                  className="relative w-full rounded bg-white px-3 py-2 text-sm text-slate-600 placeholder-slate-300 shadow outline-none focus:border-transparent focus:outline-none active:outline-none"
                  onChange={(e) =>
                    setArkimiSearch((d) => ({
                      ...d,
                      expression: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") onSubmit();
                  }}
                />
              </div>
              <div className="ml-auto">
                <span className="mr-8 inline-block align-middle">
                  <b>查詢結果</b>{" "}
                  {isLoading ? "Loading..." : searchResult.length} 筆資料
                </span>
                <button
                  className="rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
                  type="button"
                  onClick={() => {
                    onSubmit();
                  }}
                >
                  查詢
                </button>
              </div>
            </div>
          </div>
          {isError && (
            <div className="pb-4">
              <Errors errors={[error.message]} />
            </div>
          )}
          {/* our data search result */}
          <div className="max-h-[70vh] w-full overflow-auto">
            <table className="relative w-full border-collapse items-center bg-transparent">
              <thead className="sticky top-0">
                <tr>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Arkime Id
                  </th>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Source
                  </th>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Destination
                  </th>
                  <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
                    Others
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border-l-0 border-r-0 border-t-0 px-6 py-2 text-center align-middle text-sm"
                    >
                      Fetching... Loading...
                    </td>
                  </tr>
                ) : searchResult.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border-l-0 border-r-0 border-t-0 px-6 py-2 text-center align-middle text-sm"
                    >
                      查無紀錄
                    </td>
                  </tr>
                ) : (
                  <>
                    {searchResult.map(
                      ({
                        firstPacket,
                        totDataBytes,
                        ipProtocol,
                        node,
                        lastPacket,
                        source,
                        destination,
                        client,
                        server,
                        network,
                        id,
                      }) => (
                        <tr key={id} className="hover:bg-slate-100">
                          <th className="border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                            {id}
                          </th>
                          <td className="border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                            <pre>{JSON.stringify(source, undefined, 4)}</pre>
                          </td>
                          <td className="border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                            <pre>
                              {JSON.stringify(destination, undefined, 4)}
                            </pre>
                          </td>
                          <td className="border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                            <pre>
                              {JSON.stringify(
                                {
                                  node,
                                  totDataBytes,
                                  ipProtocol,
                                  firstPacket,
                                  lastPacket,
                                  client,
                                  server,
                                  network,
                                },
                                undefined,
                                4
                              )}
                            </pre>
                          </td>
                        </tr>
                      )
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ChartContainer>
    </>
  );
}
