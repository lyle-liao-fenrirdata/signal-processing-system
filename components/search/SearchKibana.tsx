import Image from "next/image";
// import { Flex2ColExt } from "@/components/search/Flex2ColExt";
import { ChartContainer } from "../commons/ChartContainer";
import { env } from "@/env.mjs";

export default function SearchKibana() {
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
    <ChartContainer title={<>查詢解析資料</>}>
      <div className="flex flex-col flex-nowrap items-center gap-2 pt-2">
        <a
          href={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_KIBANA_PORT}/app/dashboards`}
          target="_blank"
          className="flex h-12 flex-row flex-nowrap items-center justify-start opacity-80 transition-all duration-300 hover:scale-110 hover:opacity-100"
        >
          <Image
            src="/img/Kibana_Elasticsearch_Logo.svg"
            alt="Kibana Elasticsearch"
            width={40}
            height={40}
          />
          <span className="text-3xl font-extrabold text-[#2F2F2F]">Kibana</span>
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
  );
}
