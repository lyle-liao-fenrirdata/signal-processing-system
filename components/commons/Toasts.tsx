import { connect } from "mqtt";
import { useEffect } from "react";
import useMqttStore, { MqttMessage } from "@/stores/mqtt";
import ToastList from "./toast/ToastList";
import { iconMap } from "./toast/Toast";

type MessagePayload = {
  type?: keyof typeof iconMap;
  message?: { [key: string]: string } | string;
};

export default function Toasts() {
  const toast = useMqttStore((state) => state.toast);
  const setMessage = useMqttStore((state) => state.setMessage);
  const removeToast = useMqttStore((state) => state.removeToast);
  const clearToast = useMqttStore((state) => state.clearToast);

  useEffect(() => {
    function setMessageQueue(message: MqttMessage) {
      const id = Math.random().toString(16).slice(3);
      setMessage({
        id,
        ...message,
      });

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }

    const client = connect(`wss://172.16.16.31:9883`, {
      clientId: `mqtt_${Math.random().toString(16).slice(2)}`,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });
    client.on("connect", () => {
      console.log("mqtt connected");
      // setMessageQueue({
      //   message: "network online (mqtt connected)",
      //   type: "warning",
      // });
    });
    client.on("offline", () => {
      console.log("mqtt offline");
      // setMessageQueue({
      //   message: "network offline (mqtt offline)",
      //   type: "warning",
      // });
    });
    client.on("error", (error) => {
      console.log("mqtt error", error);
      setMessageQueue({ message: error.message, type: "failure" });
    });
    client.subscribe(["ftp/new_file_detected", "test/ui", "/netdata/health/+"]);
    client.on("message", (topic, msg) => {
      console.log({ topic, msg: msg.toString() });
      let type: keyof typeof iconMap = "success";
      let message = msg.toString();
      if (["{", "}", ":"].every((c) => message.includes(c))) {
        try {
          const payloadParse = JSON.parse(message) as MessagePayload;
          if (payloadParse.type) type = payloadParse.type;
          if (payloadParse.message) {
            if (typeof payloadParse.message === "string")
              message = payloadParse.message;
            else {
              let tempMsg = "";
              for (let [key, value] of Object.entries(payloadParse.message)) {
                tempMsg += `${key}: ${value}\n`;
              }
              message = tempMsg;
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      setMessageQueue({
        type,
        message,
      });
    });

    return () => {
      if (client) {
        client.subscribe([
          "ftp/new_file_detected",
          "test/ui",
          "/netdata/health/+",
        ]);
        client.end(true);
      }
      clearToast();
    };
  }, [clearToast, removeToast, setMessage]);

  return (
    <div className="absolute -left-40 bottom-0 z-10">
      <ToastList data={toast} x="left" y="bottom" removeToast={removeToast} />
    </div>
  );
}
