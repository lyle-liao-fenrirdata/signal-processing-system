export const ServiceTable = ({
  services,
}: {
  services: {
    key: string;
    name: string;
    replicated: number | string;
    status: JSX.Element;
    updatedAt: string;
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
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 text-left align-middle text-xs font-semibold text-slate-500">
          Status
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          Updated At
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
            {typeof service.replicated === "string"
              ? service.replicated
              : `replicated ${service.replicated}`}
          </td>
          <td className="flex justify-center whitespace-nowrap border-l-0 border-r-0 border-t-0 align-middle text-xs">
            {service.status}
          </td>
          <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
            {service.updatedAt}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const NodeTable = ({
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
