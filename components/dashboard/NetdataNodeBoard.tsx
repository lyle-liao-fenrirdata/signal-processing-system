import { env } from "@/env.mjs";

export const NetdataNodeBoard = ({ nodeUrl }: { nodeUrl: string }) => {
  const dataHost = `/api/netdata?url=${nodeUrl}:${env.NEXT_PUBLIC_NETDATA_PORT}&path=`;
  // const dataHost = `https://${nodeUrl}:${env.NEXT_PUBLIC_NETDATA_PORT}/`;

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
