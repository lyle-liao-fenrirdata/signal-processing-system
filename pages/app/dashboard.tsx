import React from "react";
import Script from "next/script";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import AdminLayout from "@/components/layouts/App";
import { env } from "env.mjs";
import { ChartContainer } from "@/components/commons/ChartContainer";
import { NodeTable, ServiceTable } from "@/components/dashboard/Tables";
import { NetdataNodeBoard } from "@/components/dashboard/NetdataNodeBoard";
import { Errors } from "@/components/commons/Errors";
import { Flex2Col } from "@/components/commons/Flex2Col";
import { trpc } from "@/utils/trpc";
import { formatDate } from "@/utils/formats";

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

export default function Dashboard({
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    dataUpdatedAt: nodesDataUpdatedAt,
    isError: isNodesError,
    isLoading: isNodesisLoading,
    isSuccess: isNodesSuccess,
    data: nodes,
    error: nodesError,
  } = trpc.swarm.getNodes.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    retryOnMount: true,
    retry: true,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true,
  });

  const {
    dataUpdatedAt: servicesDataUpdatedAt,
    isError: isServicesError,
    isLoading: isServicesisLoading,
    isSuccess: isServicesSuccess,
    data: services,
    error: servicesError,
  } = trpc.swarm.getServices.useQuery(undefined, {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    retryOnMount: true,
    retry: true,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: true,
  });

  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "儀表板", href: "/app/dashboard" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <>
        <Flex2Col
          left={
            <ChartContainer
              title={
                <>
                  Nodes{" "}
                  <span className="font-normal">
                    [資料更新時間: {formatDate.format(nodesDataUpdatedAt)}]
                  </span>
                </>
              }
            >
              {isNodesError ? (
                <Errors errors={[nodesError.message]} />
              ) : isNodesSuccess ? (
                !nodes.ok ? (
                  <div className="flex flex-row items-center justify-center">
                    <Errors errors={[`Docker Swarm 節點異常: ${nodes.data}`]} />
                  </div>
                ) : (
                  <NodeTable
                    nodes={nodes.data.map((node) => ({
                      key: node.ID,
                      hostname: (
                        <a
                          className="ml-3 font-bold text-slate-600 hover:underline"
                          href={`http://${node.Status.Addr}:${env.NEXT_PUBLIC_NETDATA_PORT}`}
                          target="_blank"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {node.Description.Hostname}
                        </a>
                      ),
                      state: (
                        <span
                          className={`mr-2 rounded px-2.5 py-0.5 text-xs font-medium uppercase ${
                            node.Status.State === "ready"
                              ? "bg-green-100 text-green-800"
                              : node.Status.State === "down"
                              ? "bg-gray-100 text-gray-800"
                              : node.Status.State === "disconnected"
                              ? "bg-red-100 text-red-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {node.Status.State}
                        </span>
                      ),
                      availability: (
                        <span
                          className={`mr-2 rounded px-2.5 py-0.5 text-xs font-medium uppercase ${
                            node.Spec.Availability === "active"
                              ? "bg-green-100 text-green-800"
                              : node.Spec.Availability === "pause"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {node.Spec.Availability}
                        </span>
                      ),
                    }))}
                  />
                )
              ) : (
                <></>
              )}
            </ChartContainer>
          }
          right={
            <ChartContainer
              title={
                <>
                  Services{" "}
                  <span className="font-normal">
                    [資料更新時間: {formatDate.format(servicesDataUpdatedAt)}]
                  </span>
                </>
              }
            >
              {isServicesError ? (
                <Errors errors={[servicesError.message]} />
              ) : isServicesSuccess ? (
                !services.ok ? (
                  <div className="flex flex-row items-center justify-center">
                    <Errors
                      errors={[`Docker Services 異常: ${services.data}`]}
                    />
                  </div>
                ) : (
                  <ServiceTable
                    services={services.data.map((service) => ({
                      key: service.ID,
                      name: service.Spec.Name,
                      replicated: Object.keys(
                        service.Spec?.Mode ?? {}
                      ).includes("Global")
                        ? "global"
                        : service.Spec?.Mode?.Replicated?.Replicas ?? 0,
                      status:
                        Object.keys(service.Spec?.Mode ?? {}).includes(
                          "Global"
                        ) ||
                        (service.Spec?.Mode?.Replicated?.Replicas ?? 0) > 0 ? (
                          <i className="fas fa-circle-check text-sm text-green-500"></i>
                        ) : (
                          <i className="fas fa-circle-xmark text-red-500"></i>
                        ),
                      updatedAt: formatDate.format(
                        Date.parse(service.UpdatedAt)
                      ),
                    }))}
                  />
                )
              ) : (
                <></>
              )}
            </ChartContainer>
          }
        />
        {isNodesSuccess &&
          nodes.ok &&
          nodes.data.map((node) => (
            <React.Fragment key={node.Description.Hostname}>
              <ChartContainer
                title={
                  <a
                    className="font-bold hover:underline"
                    href={`http://${node.Status.Addr}:${env.NEXT_PUBLIC_NETDATA_PORT}`}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {node.Description.Hostname} [{node.Status.Addr}]
                  </a>
                }
              >
                <>
                  <NetdataNodeBoard nodeUrl={node.Status.Addr} />
                  <span className="text-md absolute -top-4 right-2 inline-block rounded bg-transparent font-semibold drop-shadow-lg">
                    <span
                      id={node.ID}
                      className={`mr-2 rounded px-2.5 py-0.5 text-xs font-medium uppercase ${
                        node.Spec.Role === "manager"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {node.Spec.Role}
                    </span>
                  </span>
                </>
              </ChartContainer>
              <Script
                strategy="lazyOnload"
                type="text/javascript"
                src={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_NETDATA_PORT}/dashboard.js`}
              />
            </React.Fragment>
          ))}
        <ChartContainer title={<>HA PROXY</>}>
          <iframe
            src={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_HAPROXY_PORT}/`}
            title="HA PROXY"
            loading="lazy"
            height={450}
            width="100%"
          ></iframe>
        </ChartContainer>
        <Script id="disable-Bootstrap">
          var netdataNoBootstrap = true; var netdataNoFontAwesome = true; var
          netdataNoDygraphs = true; var netdataNoSparklines = true; var
          netdataNoPeitys = true; var netdataNoGoogleCharts = true; var
          netdataNoMorris = true; var netdataNoD3 = true; var netdataNoC3 =
          true; var netdataNoD3pie = true; var netdataShowHelp = false;
        </Script>
      </>
    </AdminLayout>
  );
}
