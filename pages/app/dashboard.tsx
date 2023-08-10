import React, { ReactElement } from "react";
import Script from "next/script";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import AdminLayout from "components/layouts/Admin";
import { env } from "env.mjs";
import { ChartContainer } from "@/components/commons/ChartContainer";
import { NodeTable, ServiceTable } from "@/components/dashboard/Tables";
import { NetdataNodeBoard } from "@/components/dashboard/NetdataNodeBoard";
import {
  DockerNode,
  DockerNodeError,
  DockerService,
  DockerServiceError,
  dockerNodeErrorCodes,
  dockerServiceErrorCodes,
} from "@/components/dashboard/dockerTypes";
import { Errors } from "@/components/commons/Errors";
import { Flex2Col } from "@/components/commons/Flex2Col";

export const getServerSideProps: GetServerSideProps<{
  nodes: DockerNode[];
  nodeError: DockerNodeError | false;
  services: DockerService[];
  serviceError: DockerServiceError | false;
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

  console.log(
    `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_SWARM_PORT}/nodes`
  );

  console.log(
    `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_SWARM_PORT}/services`
  );

  try {
    const [nodesResponse, servicesResponse] = await Promise.all([
      fetch(
        `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_SWARM_PORT}/nodes`
      ),
      fetch(
        `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_SWARM_PORT}/services`
      ),
    ]);

    let nodes: DockerNode[] = [];
    let nodeError: DockerNodeError | false = false;
    let services: DockerService[] = [];
    let serviceError: DockerServiceError | false = false;

    if (!nodesResponse.ok) {
      nodeError = {
        message:
          dockerNodeErrorCodes[
            nodesResponse.status.toString() as unknown as keyof typeof dockerNodeErrorCodes
          ] || "Unknown Error",
      };
    } else nodes = await nodesResponse.json();

    console.log({ nodes, nodeError });

    if (!servicesResponse.ok) {
      serviceError = {
        message:
          dockerServiceErrorCodes[
            servicesResponse.status.toString() as unknown as keyof typeof dockerServiceErrorCodes
          ] || "Unknown Error",
      };
    } else services = await servicesResponse.json();

    console.log({ services, serviceError });

    return {
      props: { nodes, nodeError, services, serviceError, username, role },
    };
  } catch (error) {
    console.log("----- dashboard page error: ", error);
    return {
      props: {
        nodes: [],
        nodeError: { message: new String(error).toString() },
        services: [],
        serviceError: false,
        username: decodeURIComponent(username),
        role,
      },
    };
  }
};

export default function Dashboard({
  nodes = [],
  nodeError = false,
  services = [],
  serviceError = false,
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "儀錶板", href: "/app/dashboard" }],
        username,
      }}
      sidebarProps={{ role, username }}
    >
      <>
        <Flex2Col
          left={
            <ChartContainer title={<>Nodes</>}>
              {nodeError ? (
                <div className="flex flex-row items-center justify-center">
                  <Errors
                    errors={[`Docker Swarm 節點異常: ${nodeError.message}`]}
                  />
                </div>
              ) : (
                <NodeTable
                  nodes={nodes.map((node) => ({
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
              )}
            </ChartContainer>
          }
          right={
            <ChartContainer title={<>Services</>}>
              {serviceError ? (
                <div className="flex flex-row items-center justify-center">
                  <Errors
                    errors={[`Docker Swarm 節點異常: ${serviceError.message}`]}
                  />
                </div>
              ) : (
                <ServiceTable
                  services={services.map((service) => ({
                    key: service.ID,
                    name: service.Spec.Name,
                    replicated: service.Spec.Mode.Replicated.Replicas,
                    status:
                      service.Spec.Mode.Replicated.Replicas > 0 ? (
                        <i className="fas fa-circle-check text-sm text-green-500"></i>
                      ) : (
                        <i className="fas fa-circle-xmark text-red-500"></i>
                      ),
                  }))}
                />
              )}
            </ChartContainer>
          }
        />
        <ChartContainer title={<>HA PROXY</>}>
          <iframe
            src={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_HAPROXY_PORT}/`}
            title="HA PROXY"
            loading="lazy"
            height={450}
            width="100%"
          ></iframe>
        </ChartContainer>
        {nodes.map((node) => (
          <ChartContainer
            key={node.Description.Hostname}
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
        ))}
        <Script id="disable-Bootstrap">
          var netdataNoBootstrap = true; var netdataNoFontAwesome = true; var
          netdataNoDygraphs = true; var netdataNoSparklines = true; var
          netdataNoPeitys = true; var netdataNoGoogleCharts = true; var
          netdataNoMorris = true; var netdataNoD3 = true; var netdataNoC3 =
          true; var netdataNoD3pie = true; var netdataShowHelp = false;
        </Script>
        <Script
          strategy="lazyOnload"
          type="text/javascript"
          src={`${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_NETDATA_PORT}/dashboard.js`}
        />
      </>
    </AdminLayout>
  );
}
