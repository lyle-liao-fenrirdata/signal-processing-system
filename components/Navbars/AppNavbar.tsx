import { connect } from "mqtt";
import { useEffect, useState } from "react";
import ToastList from "../commons/toast/ToastList";
import { iconMap } from "../commons/toast/Toast";
import useMqttStore, { MqttMessage } from "@/stores/mqtt";
import { SideList } from "../commons/toast/SideList";

export type NavbarProps = {
  breadcrumbs: { title: string; href: string }[];
  username: string;
};

export default function AppNavbar({ breadcrumbs, username }: NavbarProps) {
  const [isSideListOpen, setIsSideListOpen] = useState(false);

  const toast = useMqttStore((state) => state.toast);
  const setMessage = useMqttStore((state) => state.setMessage);
  const removeMessage = useMqttStore((state) => state.removeMessage);

  useEffect(() => {
    const client = connect("ws://192.168.16.31:9001", {
      clientId: `mqtt_${Math.random().toString(16).slice(2)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });
    client.on("connect", () => {
      console.log("mqtt connected");
    });
    client.on("offline", () => {
      console.log("mqtt offline");
      setMessageQueue({ message: "network offline", type: "warning" });
    });
    client.on("error", (error) => {
      console.log("mqtt error", error);
      setMessageQueue({ message: error.message, type: "failure" });
    });
    client.subscribe(["example/ui-test"]);
    client.on("message", (topic, message) => {
      // TODO: remove this randomness
      const type = Object.keys(iconMap).at(
        Math.floor(Math.random() * 3)
      ) as keyof typeof iconMap;

      setMessageQueue({
        type,
        message: message.toString(),
      });
    });

    return () => {
      if (client) {
        client.unsubscribe(["example/ui-test"]);
        client.end(true);
      }
    };
  }, []);

  function setMessageQueue(message: MqttMessage) {
    const id = Math.random().toString(16).slice(3);
    setMessage({
      id,
      ...message,
    });

    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  }

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
                onClick={() => setIsSideListOpen((prev) => !prev)}
              >
                <i className="fas fa-bell text-xs text-white"></i>
              </button>
            </div>
          </ul>
        </div>
      </nav>

      {/* toast */}
      <div className="absolute -left-40 bottom-0 z-10">
        <ToastList
          data={toast}
          x="left"
          y="bottom"
          removeToast={removeMessage}
        />
      </div>

      {/* message board */}
      {isSideListOpen && <SideList />}
    </>
  );
}
