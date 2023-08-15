import { connect } from "mqtt";
import { useEffect, useState } from "react";
import { Container } from "../commons/Container";

export type NavbarProps = {
  breadcrumbs: { title: string; href: string }[];
  username: string;
};

export default function AppNavbar({ breadcrumbs, username }: NavbarProps) {
  const [isWsConnected, setIsWsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const client = connect("ws://192.168.16.31:9001", {
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });
    client.on("connect", () => {
      setIsWsConnected(true);
    });
    client.subscribe(["example/ui-test"]);
    client.on("message", (topic, message) => {
      // setMessages(messages.concat(message.toString()));
      console.log({ topic, message: message.toString() });
      setMessages((prev) => [message.toString(), ...prev]);
    });

    return () => {
      if (client) {
        client.unsubscribe(["example/ui-test"]);
        client.end(true);
        setIsWsConnected(false);
      }
    };
  }, []);

  return (
    <>
      <nav className="absolute left-0 top-0 z-10 flex w-full items-center bg-transparent py-4 md:flex-row md:flex-nowrap md:justify-start md:bg-slate-800">
        <div className="mx-autp flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10">
          {/* Title */}
          {breadcrumbs.map((page, index) => (
            <span key={page.title} className="ml-4 inline first:ml-0">
              <a
                href={page.href}
                className="hidden text-lg font-semibold uppercase text-white lg:inline-block"
              >
                {page.title}
              </a>
              {index !== breadcrumbs.length - 1 && (
                <i className="fas fa-angle-right inline text-slate-500"></i>
              )}
            </span>
          ))}

          {/* User */}
          <ul className="hidden list-none flex-col items-center md:flex md:flex-row">
            <div className="flex flex-row flex-nowrap items-center gap-2">
              <span className="inline-flex h-12 min-w-fit items-center justify-center text-lg text-white">
                {username}
              </span>
              <button
                className="cursor-pointer bg-transparent px-3 py-1 text-xs leading-none text-white opacity-70 transition-all hover:opacity-100"
                type="button"
                // onClick={() => logout()}
              >
                <i className="fas fa-bell text-xs text-white"></i>
              </button>
            </div>
          </ul>
        </div>
      </nav>
      <div className="absolute -left-40 bottom-0 z-10">
        {messages.length && (
          <div className="bg-transparent pb-8 pl-6">
            <div className="relative flex w-full min-w-48 flex-col break-words rounded border-0 bg-emerald-500 px-8 py-6 text-lg text-white shadow-lg">
              {messages.at(0)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
