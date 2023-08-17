import { connect } from "mqtt";
import { useEffect } from "react";
import useMqttStore, { MqttMessage } from "@/stores/mqtt";
import ToastList from "./toast/ToastList";
import { iconMap } from "./toast/Toast";

type MessagePayload = {
  Type?: keyof typeof iconMap;
  Message?: { [key: string]: string } | string;
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

    const client = connect(`ws://192.168.16.31:9001`, {
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
    client.subscribe(["ftp/new_file_detected", "test/ui"]);
    client.on("message", (topic, msg) => {
      console.log({ topic, msg: msg.toString() });
      let type: keyof typeof iconMap = "success";
      let message = msg.toString();
      if (["{", "}", ":"].every((c) => message.includes(c))) {
        try {
          const payloadParse = JSON.parse(message) as MessagePayload;
          if (payloadParse.Type) type = payloadParse.Type;
          if (payloadParse.Message) {
            if (typeof payloadParse.Message === "string")
              message = payloadParse.Message;
            else {
              let tempMsg = "";
              for (let [key, value] of Object.entries(payloadParse.Message)) {
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
        client.unsubscribe(["example/ui-test"]);
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
