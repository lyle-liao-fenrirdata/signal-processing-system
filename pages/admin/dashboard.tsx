import React, { ReactElement } from "react";
import Script from "next/script";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

import AdminLayout from "components/layouts/Admin";
import { env } from "env.mjs";

interface DockerNode {
  ID: string;
  Version: {
    Index: number;
  };
  CreatedAt: string;
  UpdatedAt: string;
  Spec: {
    Name?: string;
    Labels?: {
      [key: string]: string;
    };
    Role: "worker" | "manager";
    Availability: "active" | "pause" | "drain";
  };
  Description: {
    Hostname: string;
    Platform: {
      Architecture: string;
      OS: string;
    };
    Resources: {
      NanoCPUs: number;
      MemoryBytes: number;
      GenericResources?: {
        NamedResourceSpec: {
          Kind: string;
          Value: string;
        };
        DiscreteResourceSpec: {
          Kind: string;
          Value: number;
        };
      }[];
    };
    Engine: {
      EngineVersion: string;
      Labels?: {
        [key: string]: string;
      };
      Plugins: {
        Type: string;
        Name: string;
      }[];
    };
    TLSInfo: {
      TrustRoot: string;
      CertIssuerSubject: string;
      CertIssuerPublicKey: string;
    };
  };
  Status: {
    State: "unknown" | "down" | "ready" | "disconnected";
    Message?: string;
    Addr: string;
  };
  ManagerStatus?: {
    Leader: boolean;
    Reachability: "unknown" | "unreachable" | "reachable";
    Addr: string;
  };
}

interface DockerNodeError {
  message: string;
}

interface DockerEndpointSpec {
  Mode: "vip" | "dnsrr";
  Ports?: {
    Protocol: string;
    TargetPort: number;
    PublishedPort: number;
    PublishMode: string;
  }[];
}

interface DockerServiceSpec {
  Name: string;
  Labels: {
    [key: string]: string;
  };
  TaskTemplate: any;
  Mode: {
    Replicated: {
      Replicas: number;
    };
    Global?: any;
  };
  UpdateConfig?: any;
  RollbackConfig?: any;
  Networks?: {
    Target: string;
    Aliases: string[];
  }[];
  EndpointSpec: DockerEndpointSpec;
}

interface DockerService {
  ID: string;
  Version: {
    Index: number;
  };
  CreatedAt: string;
  UpdatedAt: string;
  Spec: DockerServiceSpec;
  PreviousSpec?: any;
  Endpoint: {
    Spec: DockerEndpointSpec;
    Ports?: {
      Protocol: string;
      TargetPort: number;
      PublishedPort: number;
      PublishMode: string;
    }[];
    VirtualIPs?: {
      NetworkID: string;
      Addr: string;
    }[];
  };
  UpdateStatus?: {
    State: "updating" | "paused" | "completed";
    StartedAt: string;
    CompletedAt: string;
    Message: string;
  };
}

interface DockerServiceError {
  message: string;
}

const dockerNodeErrorCodes = {
  400: "Bad Parameter",
  404: "No Such Node",
  500: "Server Error",
  503: "Node is not part of a swarm.",
};

const dockerServiceErrorCodes = {
  500: "Server Error",
  503: "Node is not part of a swarm.",
};

export const getServerSideProps: GetServerSideProps<{
  nodes: DockerNode[];
  nodeError: DockerNodeError | false;
  services: DockerService[];
  serviceError: DockerServiceError | false;
}> = async () => {
  const [nodesResponse, servicesResponse] = await Promise.all([
    fetch(`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_SWARM_PORT}/nodes`),
    fetch(
      `${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_SWARM_PORT}/services`
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

  if (!servicesResponse.ok) {
    serviceError = {
      message:
        dockerServiceErrorCodes[
          servicesResponse.status.toString() as unknown as keyof typeof dockerServiceErrorCodes
        ] || "Unknown Error",
    };
  } else services = await servicesResponse.json();

  return { props: { nodes, nodeError, services, serviceError } };
};

const ChartContainer = ({
  title,
  children,
}: {
  title: JSX.Element;
  children: ReactElement;
}) => (
  <div className="relative mb-6 h-[calc(100%-1.5rem)] w-full break-words rounded bg-white shadow-lg">
    <div className="w-full p-4">
      <span className="text-md absolute -left-2 -top-4 inline-block min-w-48 rounded bg-slate-600 px-2 py-1 font-semibold text-white drop-shadow-lg">
        {title}
      </span>
      {children}
    </div>
  </div>
);

const NodeTable = ({
  nodes,
}: {
  nodes: {
    key: string;
    hostname: JSX.Element;
    state: JSX.Element;
    availability: JSX.Element;
  }[];
}) => (
  <table className="w-full border-collapse items-center bg-transparent">
    <thead>
      <tr>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Node Hostname
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Status State
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Spec Availavility
        </th>
      </tr>
    </thead>
    <tbody>
      {nodes.map((node) => (
        <tr
          key={node.key}
          className="cursor-pointer hover:bg-slate-100"
          onClick={() => {
            window.location.hash = node.key;
          }}
        >
          <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
            {node.hostname}
          </th>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {node.state}
          </td>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {node.availability}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ServiceTable = ({
  services,
}: {
  services: {
    key: string;
    name: string;
    replicated: number;
    status: JSX.Element;
  }[];
}) => (
  <table className="w-full border-collapse items-center bg-transparent">
    <thead>
      <tr>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Service Name
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Scheduling Mode
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Status
        </th>
      </tr>
    </thead>
    <tbody>
      {services.map((service) => (
        <tr key={service.key}>
          <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
            <span className="ml-3 font-bold text-slate-600">
              {service.name}
            </span>
          </th>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {`replicated ${service.replicated}`}
          </td>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {service.status}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const NetdataNodeBoard = ({ nodeUrl }: { nodeUrl: string }) => {
  const dataHost = `http://${nodeUrl}:${env.NEXT_PUBLIC_NETDATA_PORT}/`;

  return (
    <div className="flex w-full flex-wrap justify-evenly">
      <div
        className="netdata-container-easypiechart mr-1"
        data-host={dataHost}
        data-netdata="system.swap"
        data-dimensions="used"
        data-append-options="percentage"
        data-chart-library="easypiechart"
        data-title="Used Swap"
        data-units="%"
        data-easypiechart-max-value="100"
        data-width="11%"
        data-points="240"
        data-colors="#DD4400"
        role="application"
      ></div>
      <div
        className="netdata-container-easypiechart mx-1"
        data-host={dataHost}
        data-netdata="system.io"
        data-dimensions="in"
        data-chart-library="easypiechart"
        data-title="Disk Read"
        data-width="11%"
        data-points="240"
        data-common-units="system.io.mainhead"
        data-colors="#44DD00"
        role="application"
      ></div>
      <div
        className="netdata-container-easypiechart mx-1"
        data-host={dataHost}
        data-netdata="system.io"
        data-dimensions="out"
        data-chart-library="easypiechart"
        data-title="Disk Write"
        data-width="11%"
        data-points="240"
        data-common-units="system.io.mainhead"
        data-colors="#44DD00"
        role="application"
      ></div>
      <div
        className="netdata-container-gauge mx-1"
        data-host={dataHost}
        data-netdata="system.cpu"
        data-chart-library="gauge"
        data-title="CPU"
        data-units="%"
        data-gauge-max-value="100"
        data-width="20%"
        data-points="240"
        data-colors="#994499"
        role="application"
      ></div>
      <div
        className="netdata-container-easypiechart mx-1"
        data-host={dataHost}
        data-netdata="system.net"
        data-dimensions="received"
        data-chart-library="easypiechart"
        data-title="Net Inbound"
        data-width="11%"
        data-points="240"
        data-common-units="system.net.mainhead mx-1"
        data-colors="#4400DD"
        role="application"
      ></div>
      <div
        className="netdata-container-easypiechart mx-1"
        data-host={dataHost}
        data-netdata="system.net"
        data-dimensions="sent"
        data-chart-library="easypiechart"
        data-title="Net Outbound"
        data-width="11%"
        data-points="240"
        data-common-units="system.net.mainhead"
        data-colors="#4400DD"
        role="application"
      ></div>
      <div
        className="netdata-container-easypiechart ml-1"
        data-host={dataHost}
        data-netdata="system.ram"
        data-dimensions="used|buffers|active|wired"
        data-append-options="percentage"
        data-chart-library="easypiechart"
        data-title="Used RAM"
        data-units="%"
        data-easypiechart-max-value="100"
        data-width="11%"
        data-points="420"
        data-colors="#DD4400"
        role="application"
      ></div>
    </div>
  );
};

export default function Dashboard({
  nodes,
  nodeError,
  services,
  serviceError,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <AdminLayout
      navbarProps={{
        breadcrumbs: [{ title: "儀錶板", href: "/admin/dashboard" }],
        user: { name: "anonymous" },
      }}
    >
      <>
        <div className="flex flex-wrap">
          <div className="w-full md:w-6/12 md:pr-6">
            <ChartContainer title={<>Nodes</>}>
              {nodeError ? (
                <div className="flex flex-row items-center justify-center">
                  <span className="text-lg text-red-500">
                    {`Docker Swarm 節點異常: ${nodeError.message}`}
                  </span>
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
          </div>
          <div className="w-full md:w-6/12">
            <ChartContainer title={<>Services</>}>
              {serviceError ? (
                <div className="flex flex-row items-center justify-center">
                  <span className="text-lg text-red-500">
                    {`Docker Swarm 節點異常: ${serviceError.message}`}
                  </span>
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
          </div>
        </div>
        <ChartContainer title={<>HA PROXY</>}>
          <iframe
            src={`${env.NEXT_PUBLIC_SWARM_URL}:${env.NEXT_PUBLIC_HAPROXY_PORT}/`}
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
          src="http://192.168.15.13:19999/dashboard.js"
        />
      </>
    </AdminLayout>
  );
}
