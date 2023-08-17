import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { ChartContainer } from "../commons/ChartContainer";
import Modal from "../commons/Modal";
import { env } from "@/env.mjs";

export default function SearchPayload() {
  const [showArkimeSearchPayloadModal, setArkimeSearchPayloadModal] =
    useState("");
  const [arkimiSearch, setArkimiSearch] = useState({
    host: "http://192.168.16.32",
    port: "8005",
    query: "*你*",
    stopTime: null,
    startTime: null,
    arkime_node: "dca02",
  });

  function postArkimeSearchPayload() {
    arkimeSearchPayload.refetch();
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

  return (
    <>
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
              {/* <div className="flex w-full flex-row flex-nowrap items-center justify-start gap-2">
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
              </div> */}
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
                className="ml-auto mt-auto rounded border border-solid border-slate-500 bg-transparent px-4 py-2 text-xs font-bold text-slate-500 outline-none transition-all hover:bg-slate-500 hover:text-white focus:outline-none active:bg-slate-600"
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
                    Arkime Id
                  </th>
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
                        <th className="whitespace-pre border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          {JSON.stringify(val.id, undefined, 4)}
                        </th>
                        <td className="whitespace-pre border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          {JSON.stringify(val.source, undefined, 4)}
                        </td>
                        <td className="whitespace-pre border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
                          {JSON.stringify(val.destination, undefined, 4)}
                        </td>
                        <td className="whitespace-pre border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
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
          onCloseModal={() => setArkimeSearchPayloadModal("")}
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
    </>
  );
}
